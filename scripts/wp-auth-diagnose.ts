import fs from "node:fs";
import path from "node:path";

type RestResult = {
  label: string;
  method: string;
  path: string;
  status: number;
  ok: boolean;
  code?: string;
  message?: string;
  preview?: string;
};

const WP_BASE = process.env.WP_BASE_URL || "https://stacklogs.net";

function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Z_a-z][A-Z_a-z0-9]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "").trim();
  }
}

function authHeader(): Record<string, string> {
  const user = process.env.WP_USER;
  const password = process.env.WP_APP_PASSWORD;
  if (!user || !password) return {};
  const token = Buffer.from(`${user}:${password}`).toString("base64");
  return { Authorization: `Basic ${token}` };
}

function mask(value: string | undefined): string {
  if (!value) return "(missing)";
  if (value.length <= 4) return "****";
  return `${value.slice(0, 2)}***${value.slice(-2)}`;
}

async function probe(label: string, pathName: string, init: RequestInit = {}): Promise<RestResult> {
  const method = init.method || "GET";
  const res = await fetch(`${WP_BASE}${pathName}`, init);
  const text = await res.text();
  let parsed: any = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  return {
    label,
    method,
    path: pathName,
    status: res.status,
    ok: res.ok,
    code: parsed?.code,
    message: parsed?.message,
    preview: parsed
      ? JSON.stringify(parsed).slice(0, 500)
      : text.replace(/\s+/g, " ").trim().slice(0, 500),
  };
}

function printResult(result: RestResult): void {
  console.log(`## ${result.label}`);
  console.log(`${result.method} ${result.path}`);
  console.log(`status: ${result.status} ${result.ok ? "OK" : "NG"}`);
  if (result.code) console.log(`code: ${result.code}`);
  if (result.message) console.log(`message: ${result.message}`);
  if (result.preview) console.log(`preview: ${result.preview}`);
  console.log("");
}

async function main() {
  loadEnvLocal();

  const user = process.env.WP_USER;
  const password = process.env.WP_APP_PASSWORD;
  const headers = authHeader();

  console.log("# WordPress REST Auth Diagnose");
  console.log(`site: ${WP_BASE}`);
  console.log(`WP_USER: ${mask(user)}`);
  console.log(`WP_APP_PASSWORD: ${password ? `${password.length} chars` : "(missing)"}`);
  console.log(`Authorization header: ${headers.Authorization ? "present" : "missing"}`);
  console.log("");

  const publicPosts = await probe(
    "public posts endpoint",
    "/wp-json/wp/v2/posts?per_page=1&_fields=id,slug,title"
  );
  printResult(publicPosts);

  const me = await probe(
    "authenticated user",
    "/wp-json/wp/v2/users/me?context=edit&_fields=id,name,slug,roles,capabilities",
    { headers }
  );
  printResult(me);

  const target = await probe(
    "editable post read",
    "/wp-json/wp/v2/posts/269?context=edit&_fields=id,slug,status,title,content",
    { headers }
  );
  printResult(target);

  const restIndex = await probe("REST index", "/wp-json/");
  printResult(restIndex);

  console.log("## 判定メモ");
  if (!headers.Authorization) {
    console.log("- 認証情報が読み込めていません。.env.local の WP_USER / WP_APP_PASSWORD を確認。");
    process.exitCode = 1;
    return;
  }

  if (me.status === 401 || me.status === 403) {
    console.log("- /users/me が失敗。Application Password不一致、またはAuthorizationヘッダーがサーバー側で落ちています。");
    console.log("- .htaccess に `RewriteRule ^ - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]` が必要な可能性が高いです。");
    process.exitCode = 1;
    return;
  }

  if (me.ok && !target.ok) {
    console.log("- 認証は成功。ただし対象投稿の編集権限が不足しています。WPユーザーの権限を管理者/編集者にしてください。");
    process.exitCode = 1;
    return;
  }

  if (me.ok && target.ok) {
    console.log("- 認証・編集権限ともにOK。REST apply方式を使えます。");
    return;
  }

  console.log("- 結果が曖昧です。上のstatus/code/messageを確認してください。");
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
