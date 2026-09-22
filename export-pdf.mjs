import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, "index.html");
const outPath = path.resolve(__dirname, "王麒森-Agent工程师简历.pdf");

// 本机 Chrome 路径可用 CHROME_PATH 覆盖；未设置时回落到 Playwright 自带的 Chromium。
const executablePath = process.env.CHROME_PATH || undefined;
const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  try {
    await document.fonts.ready;
  } catch (_) {}
});
await page.waitForTimeout(800);
// 页边距由 index.html 的 @page 规则决定，这里不再重复指定以免冲突。
await page.pdf({
  path: outPath,
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: false,
});
const st = fs.statSync(outPath);
console.log(JSON.stringify({ out: outPath, bytes: st.size }));
await browser.close();
