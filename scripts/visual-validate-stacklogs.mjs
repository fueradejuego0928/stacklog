import fs from "node:fs/promises";
import path from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import { spawn } from "node:child_process";

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const baseUrl = "http://localhost:3000";
const outDir = "/private/tmp/stacklog-visual-validation";
const debugPort = 9300 + Math.floor(Math.random() * 500);

const pages = [
  { key: "home", label: "Home", url: "/" },
  {
    key: "category-pdf-monitoring",
    label: "PDF monitoring category",
    url: "/category/pdf-document-monitoring",
  },
  {
    key: "category-compliance",
    label: "Compliance category",
    url: "/category/compliance-audit",
  },
  {
    key: "category-vendor-procurement",
    label: "Vendor / Procurement category",
    url: "/category/vendor-procurement-workflow",
  },
  {
    key: "category-ai-workflow",
    label: "AI Workflow category",
    url: "/category/ai-workflow",
  },
  { key: "about", label: "About", url: "/about" },
];

const viewports = [
  { key: "mobile-390", width: 390, height: 844, mobile: true },
  { key: "desktop-1440", width: 1440, height: 1000, mobile: false },
];

await fs.mkdir(outDir, { recursive: true });

const chrome = spawn(chromePath, [
  "--headless",
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${path.join(outDir, `chrome-profile-${Date.now()}`)}`,
  "--no-first-run",
  "--no-sandbox",
  "--disable-gpu",
  "--hide-scrollbars",
  "about:blank",
], { stdio: ["ignore", "pipe", "pipe"] });

let chromeOutput = "";
chrome.stdout.on("data", (chunk) => {
  chromeOutput += chunk.toString();
});
chrome.stderr.on("data", (chunk) => {
  chromeOutput += chunk.toString();
});

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

async function getVersion() {
  for (let i = 0; i < 50; i += 1) {
    try {
      return await fetchJson(`http://localhost:${debugPort}/json/version`);
    } catch {
      await wait(100);
    }
  }
  throw new Error(`Chrome DevTools endpoint did not become ready\n${chromeOutput}`);
}

function createCdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const events = new Map();

  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
      return;
    }
    const handlers = events.get(message.method) ?? [];
    for (const handler of handlers) handler(message.params);
  });

  return {
    async ready() {
      if (ws.readyState === WebSocket.OPEN) return;
      await new Promise((resolve, reject) => {
        ws.addEventListener("open", resolve, { once: true });
        ws.addEventListener("error", reject, { once: true });
      });
    },
    send(method, params = {}) {
      id += 1;
      const { sessionId, ...actualParams } = params;
      ws.send(JSON.stringify({
        id,
        method,
        params: actualParams,
        ...(sessionId ? { sessionId } : {}),
      }));
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
    },
    on(method, handler) {
      events.set(method, [...(events.get(method) ?? []), handler]);
    },
    close() {
      ws.close();
    },
  };
}

async function validateLinks(links) {
  const uniqueInternal = [...new Set(links.filter((href) => href.startsWith(baseUrl)).slice(0, 40))];
  const results = [];
  for (const href of uniqueInternal) {
    try {
      const response = await fetch(href, { method: "HEAD" });
      results.push({ href, status: response.status });
    } catch (error) {
      results.push({ href, error: error.message });
    }
  }
  return results;
}

const version = await getVersion();
const cdp = createCdp(version.webSocketDebuggerUrl);
await cdp.ready();
await cdp.send("Target.setDiscoverTargets", { discover: true });

const results = [];

try {
  for (const viewport of viewports) {
    for (const page of pages) {
      const target = await cdp.send("Target.createTarget", { url: "about:blank" });
      const attached = await cdp.send("Target.attachToTarget", {
        targetId: target.targetId,
        flatten: true,
      });
      const sessionId = attached.sessionId;
      const send = (method, params = {}) => cdp.send(method, { ...params, sessionId });

      await send("Page.enable");
      await send("Runtime.enable");
      await send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewport.mobile ? 3 : 1,
        mobile: viewport.mobile,
      });

      let loaded = false;
      cdp.on("Page.loadEventFired", () => {
        loaded = true;
      });
      await send("Page.navigate", { url: `${baseUrl}${page.url}` });
      for (let i = 0; i < 80 && !loaded; i += 1) await wait(100);
      await wait(600);

      const metricsResult = await send("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const text = (el) => (el?.textContent || '').replace(/\\s+/g, ' ').trim();
          const rect = (el) => {
            const r = el.getBoundingClientRect();
            return { left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom), width: Math.round(r.width), height: Math.round(r.height) };
          };
          const visible = (el) => {
            if (!el) return false;
            const r = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth && style.visibility !== 'hidden' && style.display !== 'none';
          };
          const all = [...document.querySelectorAll('*')];
          const insideHorizontalScroller = (el) => {
            for (let node = el.parentElement; node; node = node.parentElement) {
              const style = getComputedStyle(node);
              if ((style.overflowX === 'auto' || style.overflowX === 'scroll') && node.scrollWidth > node.clientWidth) return true;
            }
            return false;
          };
          const wide = all
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter(({ el, r }) => r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && !insideHorizontalScroller(el))
            .slice(0, 15)
            .map(({ el, r }) => ({ tag: el.tagName.toLowerCase(), cls: el.className?.toString?.().slice(0, 120) || '', text: text(el).slice(0, 80), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) }));
          const navLinks = [...document.querySelectorAll('header nav a')].map((el) => ({ text: text(el), href: el.href, dataCta: el.dataset.cta || null, rect: rect(el), visible: visible(el) }));
          const ctas = [...document.querySelectorAll('[data-cta], a[href*="quietarchive"]')].map((el) => ({ text: text(el), href: el.href, dataCta: el.dataset.cta || null, rect: rect(el), visible: visible(el), inInitialViewport: visible(el) }));
          const cards = [...document.querySelectorAll('.workflow-card, .post-card')].map((el) => ({ text: text(el).slice(0, 180), rect: rect(el), visible: visible(el) }));
          const links = [...document.querySelectorAll('a[href]')].map((el) => ({ text: text(el).slice(0, 100), href: el.href, dataCta: el.dataset.cta || null }));
          const quietArchiveLinks = links.filter((link) => link.href.includes('quietarchive.net'));
          const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].map((el) => {
            try {
              const data = JSON.parse(el.textContent);
              return { valid: true, type: data['@type'], name: data.name || data.headline || null };
            } catch (error) {
              return { valid: false, error: error.message };
            }
          });
          const meta = {
            title: document.title,
            description: document.querySelector('meta[name="description"]')?.content || '',
            canonical: document.querySelector('link[rel="canonical"]')?.href || null,
            ogTitle: document.querySelector('meta[property="og:title"]')?.content || '',
            robots: document.querySelector('meta[name="robots"]')?.content || '',
          };
          const postTitles = [...document.querySelectorAll('.post-card h2, article h2, h3')].map(text).filter(Boolean).slice(0, 12);
          const navRows = [...new Set(navLinks.filter((item) => item.visible).map((item) => item.rect.top))];
          return {
            viewport: { width: innerWidth, height: innerHeight },
            scroll: { docScrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth, clientWidth: document.documentElement.clientWidth, overflowX: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > document.documentElement.clientWidth + 1 },
            wide,
            nav: { rows: navRows.length, navLinks },
            heroCtas: ctas.filter((item) => item.dataCta?.includes('hero') || item.text.includes('PDF変更監視') || item.text.includes('Workflow記事')),
            quietArchiveLinks,
            ctas,
            cards,
            meta,
            schemas,
            postTitles,
            internalLinks: links.filter((link) => link.href.startsWith('${baseUrl}')).map((link) => link.href),
            quietArchiveUtmOk: quietArchiveLinks.every((link) => link.href.includes('utm_source=stacklog') && link.href.includes('utm_medium=referral')),
            ctaDataOk: quietArchiveLinks.every((link) => link.dataCta || link.href.includes('utm_campaign=')),
          };
        })()`,
      });

      const screenshot = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        fromSurface: true,
      });
      const screenshotPath = path.join(outDir, `${page.key}-${viewport.key}.png`);
      await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));

      const metrics = metricsResult.result.value;
      const linkStatuses = await validateLinks(metrics.internalLinks);
      results.push({
        page,
        viewport,
        screenshotPath,
        metrics,
        linkStatuses,
      });

      await cdp.send("Target.closeTarget", { targetId: target.targetId });
    }
  }
} finally {
  cdp.close();
  chrome.kill("SIGTERM");
}

const summaryPath = path.join(outDir, "validation-results.json");
await fs.writeFile(summaryPath, JSON.stringify(results, null, 2));

const report = results.map((result) => ({
  page: result.page.label,
  viewport: result.viewport.key,
  screenshot: result.screenshotPath,
  overflowX: result.metrics.scroll.overflowX,
  wideElements: result.metrics.wide.length,
  navRows: result.metrics.nav.rows,
  visibleHeroCtas: result.metrics.heroCtas.filter((cta) => cta.visible).map((cta) => cta.text),
  cardCount: result.metrics.cards.length,
  visibleQuietArchiveCtas: result.metrics.quietArchiveLinks.filter((link) => {
    const cta = result.metrics.ctas.find((item) => item.href === link.href && item.text === link.text);
    return cta?.visible;
  }).map((link) => link.text),
  schemaTypes: result.metrics.schemas.map((schema) => schema.type || "invalid"),
  title: result.metrics.meta.title,
  description: result.metrics.meta.description,
  quietArchiveUtmOk: result.metrics.quietArchiveUtmOk,
  ctaDataOk: result.metrics.ctaDataOk,
  internalLinkFailures: result.linkStatuses.filter((link) => link.status && link.status >= 400 || link.error),
  postTitles: result.metrics.postTitles,
}));

console.log(JSON.stringify({ outDir, summaryPath, report }, null, 2));
