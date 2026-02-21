import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noindex?: boolean;
  jsonLd?: object;
}

const DEFAULTS = {
  ogImage: "https://watermelon-ui.com/og-image.png",
  ogType: "website",
  twitterCard: "summary_large_image",
  siteName: "Watermelon",
  locale: "en_US",
};

export function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULTS.ogImage,
  ogType = DEFAULTS.ogType,
  twitterCard = DEFAULTS.twitterCard,
  noindex = false,
  jsonLd,
}: SEOHeadProps) {
  const robots = noindex
    ? "noindex,nofollow"
    : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1";

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
      {canonical && (
        <link rel="alternate" hrefLang="en-us" href={canonical} />
      )}
      {canonical && (
        <link rel="alternate" hrefLang="x-default" href={canonical} />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={DEFAULTS.siteName} />
      <meta property="og:locale" content={DEFAULTS.locale} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
