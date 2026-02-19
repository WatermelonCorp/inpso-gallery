import { useState } from "react";
import type { SiteMetadata } from "@/content/sites";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Globe,
  Calendar,
  Layers,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Dummy placeholder images for the gallery
const DUMMY_IMAGES = [
  "https://picsum.photos/seed/site-detail-1/800/450",
  "https://picsum.photos/seed/site-detail-2/800/450",
  "https://picsum.photos/seed/site-detail-3/800/450",
];

interface SiteDetailModalProps {
  site: SiteMetadata | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SiteDetailModal({
  site,
  open,
  onOpenChange,
}: SiteDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!site) return null;

  const baseImages = site.images?.length ? site.images : [site.thumbnail];
  const images = [...baseImages, ...DUMMY_IMAGES];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-3xl w-full max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-2xl!"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{site.name}</DialogTitle>
          <DialogDescription>{site.description}</DialogDescription>
        </DialogHeader>

        {/* Image Gallery */}
        <div className="relative w-full group">
          <div className="aspect-video w-full overflow-hidden bg-muted rounded-t-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImageIndex}
                src={images[selectedImageIndex]}
                alt={`${site.name} screenshot ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all duration-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={cn(
                    "shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200",
                    i === selectedImageIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <h2 className="text-2xl font-bold tracking-tight">{site.name}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {site.description}
              </p>
            </div>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button className="gap-2 font-medium" size="sm">
                Visit Site
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>

          <Separator />

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                <Layers className="h-3 w-3" />
                Category
              </span>
              <Badge variant="secondary" className="capitalize font-normal">
                {site.category}
              </Badge>
            </div>

            <div className="space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                <Globe className="h-3 w-3" />
                Platform
              </span>
              <span className="text-sm text-foreground/90">
                {site.platform.join(", ")}
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                <Calendar className="h-3 w-3" />
                Added
              </span>
              <span className="text-sm text-foreground/90">{site.date}</span>
            </div>

            <div className="space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                <Tag className="h-3 w-3" />
                Style
              </span>
              <span className="text-sm text-foreground/90 capitalize">
                {site.style.join(", ")}
              </span>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Tech Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {site.tech.map((t) => (
                <Badge key={t} variant="outline" className="font-normal text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tags */}
          {site.tags.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {site.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-muted-foreground/80 hover:text-foreground cursor-default transition-colors"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
