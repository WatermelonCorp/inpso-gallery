
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { sites, type SiteMetadata } from "@/content/sites";
import { filterSites, initialFilterState, type FilterState } from "@/lib/filter-sites";
import { FilterBar } from "@/components/filter-bar";
import { SiteGrid } from "@/components/site-grid";
import { AdvancedFiltersSheet } from "@/components/advanced-filters-sheet";
import { Container } from "@/components/layout/container";
import { HorizontalLine } from "@/components/layout/line";


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
      aesthetics: params.aesthetics ? params.aesthetics.split(",") : [],
      effects: params.effects ? params.effects.split(",") : [],
      typography: params.typography ? params.typography.split(",") : [],
      composition: params.composition ? params.composition.split(",") : [],
      colorScheme: params.colorScheme ? params.colorScheme.split(",") : [],
      interaction: params.interaction ? params.interaction.split(",") : [],
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
    if (filters.aesthetics.length) params.aesthetics = filters.aesthetics.join(",");
    if (filters.effects.length) params.effects = filters.effects.join(",");
    if (filters.typography.length) params.typography = filters.typography.join(",");
    if (filters.composition.length) params.composition = filters.composition.join(",");
    if (filters.colorScheme.length) params.colorScheme = filters.colorScheme.join(",");
    if (filters.interaction.length) params.interaction = filters.interaction.join(",");
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

  // Extract unique counts for design-centric filters
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
      aesthetics: getCounts("aesthetics"),
      effects: getCounts("effects"),
      typography: getCounts("typography"),
      composition: getCounts("composition"),
      colorScheme: getCounts("colorScheme"),
      interaction: getCounts("interaction"),
    };
  }, []);




  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      {/* Decorative blurred orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-primary/6 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto relative z-10">
        <header className="text-center md:text-left max-w-7xl mx-auto border-x py-10 px-4 relative z-30 bg-background">
          <p className="text-muted-foreground text-lg max-w-2xl">
            A curated directory of the best design resources, UI libraries, and tools for modern web development.
          </p>
        </header>
        <div className="relative z-30">
          <HorizontalLine />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-0 md:px-0">
          {/* Layer 1: Visual Sticky Container Background */}
          <div className="absolute inset-x-0 top-0 bottom-0 z-0 pointer-events-none">
            <div className="sticky top-16 h-[calc(100vh-4rem)] w-full">
              <Container className="w-full h-full">
                <div className="hidden" />
              </Container>
            </div>
          </div>

          {/* Layer 2: Scrolling Content */}
          <div className="relative z-10 w-full pointer-events-none">
            <div className="pointer-events-auto">

              {/* Opaque Sticky Mask to hide sliding cards and hold FilterBar */}
              <div className="sticky top-16 z-20 w-full bg-background mt-4 md:mt-0">
                <div className="pt-2 px-2 border-t border-x border-b-0 border-border/40 bg-black/5 backdrop-blur-xl shadow-[inset_0_2px_5px_var(--color-neutral-300)] dark:shadow-[inset_0_2px_5px_var(--color-neutral-700)] dark:bg-white/5">
                  <div className="border bg-background border-border/50 border-b-0 pt-2 px-2 md:px-4 lg:px-10 pb-2 rounded-t-2xl relative z-20 w-full flex flex-col">
                    <FilterBar
                      filters={filters}
                      setFilters={setFilters}
                      onOpenAdvancedFilters={() => setIsAdvancedOpen(true)}
                      className="static bg-background/0 backdrop-blur-none w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Grid Content */}
              <main className="w-full px-[calc(0.5rem+1px+0.5rem)] md:px-[calc(0.5rem+1px+1rem)] lg:px-[calc(0.5rem+1px+2.5rem)] pt-1 md:pt-4 pb-12 relative z-10 border-x border-transparent">
                <SiteGrid sites={filteredSites} isLoading={isMounting} />
              </main>

              {/* Clean Bottom Edge (No Glass) */}
              <div className="sticky bottom-0 z-20 w-full pointer-events-none bg-background">
                <div className="px-2.5 pb-2.5 pt-0 backdrop-blur-3xl bg-black/5 dark:bg-white/5 
shadow-[
  inset_0_-2px_5px_var(--color-neutral-300),
  inset_2px_0_5px_var(--color-neutral-300),
  inset_-2px_0_5px_var(--color-neutral-300)
]
dark:shadow-[
  inset_0_-2px_5px_var(--color-neutral-700),
  inset_2px_0_5px_var(--color-neutral-700),
  inset_-2px_0_5px_var(--color-neutral-700)
]
                ">

                  <div className="bg-linear-to-b from-white dark:from-black to-background rounded-b-2xl h-3" />


                </div>
              </div>

              <AdvancedFiltersSheet
                open={isAdvancedOpen}
                onOpenChange={setIsAdvancedOpen}
                filters={filters}
                setFilters={setFilters}
                counts={counts}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
