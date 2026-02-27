import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const BASE_URL = process.env.SITE_URL || "https://watermelon-ui.com";
const TODAY = new Date().toISOString().split("T")[0];

function mapPageFileToRoute(file) {
  const base = file.replace(/\.tsx$/i, "").toLowerCase();
  if (base === "index" || base === "page") return "/";
  if (base === "404") return null;
  return `/${base}`;
}

async function collectMainRoutes() {
  const pagesDir = path.join(ROOT, "src", "pages");
  const files = await fs.readdir(pagesDir);
  const routes = files
    .filter((file) => file.endsWith(".tsx"))
    .map(mapPageFileToRoute)
    .filter(Boolean);

  if (!routes.includes("/")) routes.unshift("/");
  return [...new Set(routes)].sort();
}

function buildUrlset(entries) {
  const urls = entries
    .map(
      ({ loc, lastmod, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildSitemapIndex(files) {
  const items = files
    .map(
      (file) => `  <sitemap>
    <loc>${BASE_URL}/${file}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>
`;
}

async function generateSitemaps() {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  const routes = await collectMainRoutes();
  const mainEntries = routes.map((route) => ({
    loc: `${BASE_URL}${route}`,
    lastmod: TODAY,
    changefreq: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? "1.0" : "0.7",
  }));

  const mainSitemap = buildUrlset(mainEntries);
  await fs.writeFile(path.join(PUBLIC_DIR, "sitemap-main.xml"), mainSitemap, "utf8");

  const index = buildSitemapIndex(["sitemap-main.xml"]);
  await fs.writeFile(path.join(PUBLIC_DIR, "sitemap_index.xml"), index, "utf8");
  await fs.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), index, "utf8");

  console.log(`Generated sitemap-main.xml (${mainEntries.length} URLs)`);
  console.log("Generated sitemap_index.xml and sitemap.xml");
}

generateSitemaps().catch((error) => {
  console.error("Failed to generate sitemaps:", error);
  process.exit(1);
});
