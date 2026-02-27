import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const PUBLIC_DIR = path.join(ROOT, "public");

function mapPageFileToRoute(file) {
  const base = file.replace(/\.tsx$/i, "").toLowerCase();
  if (base === "index" || base === "page") return "/";
  if (base === "404") return "/404";
  return `/${base}`;
}

async function expectedRoutes() {
  const pagesDir = path.join(ROOT, "src", "pages");
  const files = await fs.readdir(pagesDir);
  const routes = files.filter((file) => file.endsWith(".tsx")).map(mapPageFileToRoute);
  return [...new Set(routes)].sort();
}

function routeToOutputPath(route) {
  if (route === "/") return path.join(DIST_DIR, "index.html");
  const cleanRoute = route.startsWith("/") ? route.slice(1) : route;
  return path.join(DIST_DIR, `${cleanRoute}.html`);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function verify() {
  const routes = await expectedRoutes();
  let failed = false;

  for (const route of routes) {
    const outputPath = routeToOutputPath(route);
    if (!(await exists(outputPath))) {
      console.error(`Missing prerendered file: ${path.relative(ROOT, outputPath)}`);
      failed = true;
    }
  }

  const sitemapMain = path.join(PUBLIC_DIR, "sitemap-main.xml");
  const sitemapIndex = path.join(PUBLIC_DIR, "sitemap_index.xml");
  const sitemapCompat = path.join(PUBLIC_DIR, "sitemap.xml");

  for (const file of [sitemapMain, sitemapIndex, sitemapCompat]) {
    if (!(await exists(file))) {
      console.error(`Missing sitemap file: ${path.relative(ROOT, file)}`);
      failed = true;
    }
  }

  if (await exists(sitemapMain)) {
    const xml = await fs.readFile(sitemapMain, "utf8");
    const urlCount = (xml.match(/<url>/g) || []).length;
    console.log(`sitemap-main.xml URLs: ${urlCount}`);
  }

  if (failed) {
    process.exit(1);
  }

  console.log("Verification passed.");
}

verify().catch((error) => {
  console.error("Verification failed:", error);
  process.exit(1);
});
