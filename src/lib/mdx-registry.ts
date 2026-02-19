
import { lazy, type ComponentType } from 'react';

// Use Vite's import.meta.glob to get all MDX files
const mdxModules = import.meta.glob('../content/sites/*.mdx');

// Map slugs to lazy-loaded components
export const mdxRegistry: Record<string, React.LazyExoticComponent<ComponentType<any>>> = {};

for (const path in mdxModules) {
  // Extract slug from filename (e.g., ../content/sites/aceternity-ui.mdx -> aceternity-ui)
  const slug = path.split('/').pop()?.replace('.mdx', '');

  if (slug) {
    mdxRegistry[slug] = lazy(mdxModules[path] as any);
  }
}
