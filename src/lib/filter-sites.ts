
import type { SiteMetadata } from "@/content/sites";

export interface FilterState {
  search: string;
  category: string;
  tags: string[];
  tech: string[];
  platform: string[];
  animation: string[];
  style: string[];
  color: string[];
  layout: string[];
  featured: boolean;
  sort: 'newest' | 'featured' | 'alphabetical';
}

export const initialFilterState: FilterState = {
  search: "",
  category: "all",
  tags: [],
  tech: [],
  platform: [],
  animation: [],
  style: [],
  color: [],
  layout: [],
  featured: false,
  sort: "newest",
};

export function filterSites(sites: SiteMetadata[], filters: FilterState): SiteMetadata[] {
  return sites.filter((site) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        site.name.toLowerCase().includes(searchLower) ||
        site.description.toLowerCase().includes(searchLower) ||
        site.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        site.tech.some((t) => t.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      if (site.category !== filters.category) return false;
    }

    // Featured filter
    if (filters.featured && !site.featured) return false;

    // Array-based filters (must match at least one selected item if any are selected)
    const checkArrayFilter = (
      siteArray: string[],
      filterArray: string[]
    ) => {
      if (filterArray.length === 0) return true;
      return filterArray.some((item) => siteArray.includes(item));
    };

    if (!checkArrayFilter(site.tags, filters.tags)) return false;
    if (!checkArrayFilter(site.tech, filters.tech)) return false;
    if (!checkArrayFilter(site.platform, filters.platform)) return false;
    if (!checkArrayFilter(site.animation, filters.animation)) return false;
    if (!checkArrayFilter(site.style, filters.style)) return false;
    if (!checkArrayFilter(site.color, filters.color)) return false;
    if (!checkArrayFilter(site.layout, filters.layout)) return false;

    return true;
  }).sort((a, b) => {
    switch (filters.sort) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "featured":
        return (Number(b.featured) - Number(a.featured)) || (new Date(b.date).getTime() - new Date(a.date).getTime());
      case "alphabetical":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
}
