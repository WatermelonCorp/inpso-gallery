
import type { SiteMetadata } from "@/content/sites";

export interface FilterState {
  search: string;
  category: string;
  tags: string[];
  aesthetics: string[];
  effects: string[];
  typography: string[];
  composition: string[];
  colorScheme: string[];
  interaction: string[];
  featured: boolean;
  sort: 'newest' | 'featured' | 'alphabetical';
}

export const initialFilterState: FilterState = {
  search: "",
  category: "all",
  tags: [],
  aesthetics: [],
  effects: [],
  typography: [],
  composition: [],
  colorScheme: [],
  interaction: [],
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
        site.tech.some((t) => t.toLowerCase().includes(searchLower)) ||
        site.aesthetics.some((a) => a.toLowerCase().includes(searchLower)) ||
        site.effects.some((e) => e.toLowerCase().includes(searchLower));

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
    if (!checkArrayFilter(site.aesthetics, filters.aesthetics)) return false;
    if (!checkArrayFilter(site.effects, filters.effects)) return false;
    if (!checkArrayFilter(site.typography, filters.typography)) return false;
    if (!checkArrayFilter(site.composition, filters.composition)) return false;
    if (!checkArrayFilter(site.colorScheme, filters.colorScheme)) return false;
    if (!checkArrayFilter(site.interaction, filters.interaction)) return false;

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
