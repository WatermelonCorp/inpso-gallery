
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { sites, type SiteMetadata } from "@/content/sites";
import { filterSites, initialFilterState, type FilterState } from "@/lib/filter-sites";
import { FilterBar } from "@/components/filter-bar";
import { SiteGrid } from "@/components/site-grid";
import { AdvancedFiltersSheet } from "@/components/advanced-filters-sheet";

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isMounting, setIsMounting] = useState(true);

  // Initialize state from URL params if available, otherwise default
  const [filters, setFilters] = useState<FilterState>(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      ...initialFilterState,
      search: params.search || "",
      category: params.category || "all",
      tags: params.tags ? params.tags.split(",") : [],
      tech: params.tech ? params.tech.split(",") : [],
      platform: params.platform ? params.platform.split(",") : [],
      animation: params.animation ? params.animation.split(",") : [],
      style: params.style ? params.style.split(",") : [],
      color: params.color ? params.color.split(",") : [],
      layout: params.layout ? params.layout.split(",") : [],
      featured: params.featured === "true",
      sort: (params.sort as any) || "newest",
    };
  });

  // Sync state to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.category !== "all") params.category = filters.category;
    if (filters.tags.length) params.tags = filters.tags.join(",");
    if (filters.tech.length) params.tech = filters.tech.join(",");
    if (filters.platform.length) params.platform = filters.platform.join(",");
    if (filters.animation.length) params.animation = filters.animation.join(",");
    if (filters.style.length) params.style = filters.style.join(",");
    if (filters.color.length) params.color = filters.color.join(",");
    if (filters.layout.length) params.layout = filters.layout.join(",");
    if (filters.featured) params.featured = "true";
    if (filters.sort !== "newest") params.sort = filters.sort;

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Simulate initial load for smooth transition
  useEffect(() => {
    const timer = setTimeout(() => setIsMounting(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredSites = useMemo(() => {
    return filterSites(sites, filters);
  }, [filters]);

  // Extract unique tags and counts for filters
  const counts = useMemo(() => {
    const getCounts = (key: keyof SiteMetadata) => {
      const counts: Record<string, number> = {};
      sites.forEach((site) => {
        const value = site[key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            counts[item] = (counts[item] || 0) + 1;
          });
        }
      });
      return counts;
    };

    return {
      tech: getCounts("tech"),
      platform: getCounts("platform"),
      animation: getCounts("animation"),
      style: getCounts("style"),
      color: getCounts("color"),
      layout: getCounts("layout"),
    };
  }, []);

  const uniqueTags = useMemo(() => {
    const allTags = sites.flatMap(site => site.tags);
    return Array.from(new Set(allTags));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center md:text-left">
          <p className="text-muted-foreground text-lg max-w-2xl">
            A curated directory of the best design resources, UI libraries, and tools for modern web development.
          </p>
        </header>

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onOpenAdvancedFilters={() => setIsAdvancedOpen(true)}
          uniqueTags={uniqueTags}
        />

        <main className="mt-8">
          <SiteGrid sites={filteredSites} isLoading={isMounting} />
        </main>

        <AdvancedFiltersSheet
          open={isAdvancedOpen}
          onOpenChange={setIsAdvancedOpen}
          filters={filters}
          setFilters={setFilters}
          counts={counts}
        />
      </div>
    </div>
  );
}
