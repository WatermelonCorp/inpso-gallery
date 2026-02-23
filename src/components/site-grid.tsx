
import type { SiteMetadata } from "@/content/sites";
import { SiteCardWithModal } from "@/components/site-card";
import { motion, AnimatePresence } from "framer-motion";

interface SiteGridProps {
  sites: SiteMetadata[];
  isLoading?: boolean;
}

export function SiteGrid({ sites, isLoading = false }: SiteGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="group relative border border-border/40 bg-black/5 shadow-inner shadow-black/10 dark:shadow-white/10 backdrop-blur-lg dark:bg-white/5 p-2 w-full text-left"
          >
            <div className="overflow-hidden rounded-2xl border border-border/40 shadow-sm">
              <div className="relative aspect-4/3 md:aspect-16/10 overflow-hidden bg-muted/60 animate-pulse" />
            </div>

            <div className="flex items-center justify-between px-2 pt-2">
              <div className="h-4 w-1/3 bg-muted/60 animate-pulse rounded col-span-2" />
              <div className="h-3.5 w-3.5 bg-muted/60 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-xl font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground max-w-sm">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {sites.map((site) => (
          <motion.div
            key={site.slug}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <SiteCardWithModal site={site} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
