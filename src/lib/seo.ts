// SEO utilities and JSON-LD structured data generation

const BASE_URL = "https://watermelon-ui.com";
const SITE_NAME = "Watermelon";
const SITE_DESCRIPTION =
  "A curated directory of the best design resources, UI libraries, and tools for modern web development.";

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
  jsonLd: object;
}

/** Organization schema for the brand */
function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: SITE_NAME,
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.png`,
    },
    sameAs: [],
  };
}

/** WebSite schema with search action */
function webSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${BASE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** WebPage schema */
function webPageSchema(title: string, description: string, canonical: string) {
  return {
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    inLanguage: "en-US",
  };
}

/** ItemList schema for the curated collection */
function itemListSchema(
  items: Array<{ name: string; url: string; position: number }>
) {
  return {
    "@type": "ItemList",
    name: "Curated Design Inspiration",
    description:
      "Hand-picked collection of outstanding web design resources and UI libraries",
    numberOfItems: items.length,
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}

/** Generate full SEO data for the homepage */
export function generateHomepageSEO(
  sites: Array<{ name: string; url: string }>
): SEOData {
  const title = "Watermelon — Curated Design Inspiration Gallery";
  const description = SITE_DESCRIPTION;
  const keywords =
    "design inspiration, UI library, web design, design resources, UI components, design tools, frontend, curated gallery, shadcn, aceternity, react components";
  const canonical = `${BASE_URL}/`;
  const ogImage = `${BASE_URL}/og-image.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      webSiteSchema(),
      webPageSchema(title, description, canonical),
      itemListSchema(
        sites.map((site, i) => ({
          name: site.name,
          url: site.url,
          position: i + 1,
        }))
      ),
    ],
  };

  return { title, description, keywords, canonical, ogImage, jsonLd };
}
