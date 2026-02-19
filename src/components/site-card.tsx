
import type { SiteMetadata } from "@/content/sites";
import { Card, CardHeader } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface SiteCardProps {
  site: SiteMetadata;
  onSelect?: (site: SiteMetadata) => void;
}

export function SiteCard({ site, onSelect }: SiteCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className="group ring-transparent overflow-hidden bg-card border-transparent hover:bg-accent/40 py-0 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col cursor-pointer"
        onClick={() => onSelect?.(site)}
      >
        <div className="relative aspect-video overflow-hidden bg-muted">
          {/* Placeholder for thumbnail if not available or whilst loading */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted group-hover:scale-105 transition-transform duration-500">
            <span className="text-sm font-medium">{site.name}</span>
          </div>

          {site.thumbnail && (
            <img
              src={site.thumbnail}
              alt={site.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute bottom-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-110 active:scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-card-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                {site.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {site.description}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
