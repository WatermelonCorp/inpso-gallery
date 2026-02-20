
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
          <div key={i} className="aspect-video rounded-xl bg-muted animate-pulse" />
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
