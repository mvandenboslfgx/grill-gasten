/**
 * Lichte UI-smoke: horizontale overflow + navbar-aanwezigheid.
 * Vereist een draaiende server (bijv. npm run start op :3000).
 *
 * Run: node scripts/ui-smoke-overflow.mjs [baseUrl]
 */

const base = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");

const routes = [
  "/",
  "/menu",
  "/bestellen",
  "/catering",
  "/about",
  "/contact",
  "/privacy",
  "/voorwaarden",
];

const viewports = [
  { w: 320, h: 568 },
  { w: 360, h: 800 },
  { w: 375, h: 812 },
  { w: 390, h: 844 },
  { w: 430, h: 932 },
  { w: 768, h: 1024 },
  { w: 820, h: 1180 },
  { w: 1024, h: 768 },
  { w: 1280, h: 800 },
  { w: 1366, h: 768 },
  { w: 1440, h: 900 },
];

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.log("SKIP: playwright niet geïnstalleerd — gebruik browserpreview handmatig.");
    console.log(`Base URL zou zijn: ${base}`);
    process.exit(0);
  }

  const browser = await chromium.launch({ headless: true });
  const failures = [];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    for (const route of routes) {
      const url = `${base}${route}`;
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
        const result = await page.evaluate(() => {
          const el = document.documentElement;
          const overflow = el.scrollWidth > el.clientWidth + 1;
          const header = document.querySelector("header");
          const mobileBtn = document.querySelector('button[aria-controls="mobile-nav"]');
          const desktopNav = document.querySelector('nav[aria-label="Hoofdnavigatie"]');
          const mobileVisible = mobileBtn
            ? window.getComputedStyle(mobileBtn).display !== "none"
            : false;
          const desktopVisible = desktopNav
            ? window.getComputedStyle(desktopNav).display !== "none"
            : false;
          const whatsappMike = document.body.innerText.includes("WhatsApp Mike");
          return {
            overflow,
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            hasHeader: Boolean(header),
            mobileVisible,
            desktopVisible,
            whatsappMike,
          };
        });

        if (result.overflow) {
          failures.push(`${route} @${vp.w}: overflow ${result.scrollWidth}>${result.clientWidth}`);
        }
        if (!result.hasHeader) {
          failures.push(`${route} @${vp.w}: geen header`);
        }
        if (result.whatsappMike) {
          failures.push(`${route} @${vp.w}: WhatsApp Mike gevonden`);
        }
        // Onder xl (1280): mobiele knop zichtbaar, desktopnav niet
        if (vp.w < 1280) {
          if (!result.mobileVisible) {
            failures.push(`${route} @${vp.w}: mobiele menuknop niet zichtbaar`);
          }
          if (result.desktopVisible) {
            failures.push(`${route} @${vp.w}: desktopnav zichtbaar onder xl`);
          }
        } else {
          if (!result.desktopVisible) {
            failures.push(`${route} @${vp.w}: desktopnav niet zichtbaar`);
          }
          if (result.mobileVisible) {
            failures.push(`${route} @${vp.w}: mobiele knop zichtbaar op xl+`);
          }
        }
      } catch (e) {
        failures.push(`${route} @${vp.w}: ${e instanceof Error ? e.message : "error"}`);
      }
    }
    await page.close();
  }

  await browser.close();

  if (failures.length) {
    console.error("UI smoke FAILED:");
    for (const f of failures) console.error(" -", f);
    process.exit(1);
  }

  console.log(`UI smoke OK — ${routes.length} routes × ${viewports.length} viewports`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
