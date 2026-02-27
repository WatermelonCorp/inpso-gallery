import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, "dist");
const TEMPLATE_PATH = path.join(DIST_DIR, "index.html");

function createStorageMock() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

function applyServerMocks() {
  const headNode = {
    appendChild() {},
  };

  if (!globalThis.window) {
    globalThis.window = {
      matchMedia: () => ({ matches: false }),
      addEventListener() {},
      removeEventListener() {},
    };
  }
  if (!globalThis.localStorage) globalThis.localStorage = createStorageMock();
  if (!globalThis.sessionStorage) globalThis.sessionStorage = createStorageMock();
  if (!globalThis.document) {
    globalThis.document = {
      addEventListener() {},
      removeEventListener() {},
      createElement() {
        return { setAttribute() {}, appendChild() {}, style: {} };
      },
      createTextNode() {
        return {};
      },
      getElementsByTagName(tagName) {
        if (tagName === "head") return [headNode];
        return [];
      },
      head: headNode,
    };
  }
}

async function resolveServerEntry() {
  const candidates = [
    path.join(DIST_DIR, "server", "entry-server.js"),
    path.join(DIST_DIR, "server", "entry-server.mjs"),
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try next candidate.
    }
  }

  throw new Error("Server entry not found. Build SSR bundle first (dist/server/entry-server.js).");
}

function mapPageFileToRoute(file) {
  const base = file.replace(/\.tsx$/i, "").toLowerCase();
  if (base === "index" || base === "page") return "/";
  if (base === "404") return "/404";
  return `/${base}`;
}

async function collectRoutes() {
  const pagesDir = path.join(__dirname, "src", "pages");
  const files = await fs.readdir(pagesDir);
  const staticRoutes = files
    .filter((file) => file.endsWith(".tsx"))
    .map(mapPageFileToRoute);

  return [...new Set(staticRoutes)].sort();
}

function toHelmetString(helmet) {
  if (!helmet) return "";
  const priority = helmet.priority?.toString ? helmet.priority.toString() : "";
  if (priority) return priority;

  const parts = ["meta", "link", "style", "script", "noscript", "base"]
    .map((key) => (helmet[key]?.toString ? helmet[key].toString() : ""))
    .filter(Boolean);

  return parts.join("\n");
}

function injectHelmet(template, helmet) {
  let html = template
    .replace(/<title[^>]*data-rh="true"[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta[^>]*data-rh="true"[^>]*\/?>/gi, "")
    .replace(/<link[^>]*data-rh="true"[^>]*\/?>/gi, "")
    .replace(/<script[^>]*data-rh="true"[^>]*>[\s\S]*?<\/script>/gi, "");

  const titleTag = helmet?.title?.toString ? helmet.title.toString() : "";
  if (titleTag) {
    html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, titleTag);
  }

  const helmetTags = toHelmetString(helmet);
  if (!helmetTags) return html;
  return html.replace("</head>", `${helmetTags}\n</head>`);
}

function routeToOutputPath(route) {
  if (route === "/") return path.join(DIST_DIR, "index.html");
  const cleanRoute = route.startsWith("/") ? route.slice(1) : route;
  return path.join(DIST_DIR, `${cleanRoute}.html`);
}

async function prerender() {
  applyServerMocks();

  const template = await fs.readFile(TEMPLATE_PATH, "utf8");
  const routes = await collectRoutes();
  const serverEntryPath = await resolveServerEntry();
  const serverModule = await import(pathToFileURL(serverEntryPath).href);

  if (typeof serverModule.render !== "function") {
    throw new Error("SSR server entry does not export a render(url) function.");
  }

  let successCount = 0;
  let errorCount = 0;

  for (const route of routes) {
    try {
      const rendered = await serverModule.render(route);
      const appHtml = typeof rendered === "string" ? rendered : rendered.html;
      const helmet = typeof rendered === "object" ? rendered.helmet : undefined;

      if (!appHtml) {
        throw new Error("render() returned empty HTML.");
      }

      const withApp = template.replace("<!--app-html-->", appHtml);
      const html = injectHelmet(withApp, helmet);
      const outputPath = routeToOutputPath(route);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, html, "utf8");

      successCount += 1;
      console.log(`prerendered: ${route} -> ${path.relative(__dirname, outputPath)}`);
    } catch (error) {
      errorCount += 1;
      console.error(`failed: ${route}`, error);
    }
  }

  console.log(`\nPrerender complete. Success: ${successCount}, Failed: ${errorCount}`);
  if (errorCount > 0) process.exitCode = 1;
}

prerender().catch((error) => {
  console.error("Prerender failed:", error);
  process.exit(1);
});
