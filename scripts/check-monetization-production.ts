const WP_BASE = process.env.WP_BASE_URL || "https://stacklogs.net";
const url = `${WP_BASE}/_monetization_production.php?mode=dry`;

async function main() {
  const res = await fetch(url);
  const text = await res.text();

  console.log(`# check monetization production php`);
  console.log(`url: ${url}`);
  console.log(`status: ${res.status} ${res.statusText}`);

  if (res.status === 404) {
    console.log("result: not uploaded");
    console.log("next: upload /Users/zen/stacklog/scripts/_monetization_production.php to WordPress root");
    return;
  }

  if (res.status === 403) {
    console.log("result: forbidden");
    console.log("next: update allowed IPs in scripts/build-monetization-production.ts and regenerate");
    return;
  }

  if (!res.ok) {
    console.log("result: unexpected response");
    console.log(text.slice(0, 1200));
    process.exitCode = 1;
    return;
  }

  console.log("result: uploaded and executable");
  console.log("");
  console.log(text.slice(0, 4000));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
