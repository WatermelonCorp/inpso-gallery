"use client";

import type { SiteMetadata } from "@/content/sites";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon, Cancel01Icon, ArrowUpRight01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { PrimaryButton } from "./primary-button";

interface SiteCardWithModalProps {
  site: SiteMetadata;
}

export function SiteCardWithModal({ site }: SiteCardWithModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const buildGallery = (): string[] => {
    const base: string[] = site.images?.length ? site.images : [site.thumbnail];
    const filled: string[] = [];
    for (let i = 0; i < 4; i++) {
      filled.push(base[i % base.length]);
    }
    return filled;
  };

  const galleryImages = buildGallery();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setActiveIndex(0);
      setShowScrollHint(true);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollTop = el.scrollTop;
      const imgHeight = el.scrollHeight / galleryImages.length;
      const idx = Math.round(scrollTop / imgHeight);
      setActiveIndex(Math.min(idx, galleryImages.length - 1));
      if (scrollTop > 20) setShowScrollHint(false);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [galleryImages.length, isOpen]);

  const scrollToImage = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const imgHeight = el.scrollHeight / galleryImages.length;
    el.scrollTo({ top: imgHeight * index, behavior: "smooth" });
  };

  const cardId = `card-${site.url.replace(/[^a-zA-Z0-9]/g, "-")}`;

  return (
    <>
      {/* ── Card Trigger ── */}
      <motion.div
        layoutId={`card-${cardId}`}
        onClick={() => setIsOpen(true)}
        className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-card border border-border/40 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/8 transition-colors duration-300 cursor-pointer"
        style={{ borderRadius: 16 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {/* Shimmer top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        {/* Thumbnail */}
        <div className="relative overflow-hidden">
          <img
            src={site.thumbnail}
            alt={site.name}
            className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* External link button */}
          <div className="absolute top-3 right-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm text-foreground shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Name label */}
          <div className="absolute bottom-1 right-2 bg-card py-1 px-2 rounded-lg">
            <h3 className="font-medium text-sm text-card-foreground leading-tight truncate">
              {site.name}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* ── Modal Overlay ── */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />

              {/* Morphing modal card */}
              <div className="fixed inset-0 z-110 flex items-center justify-center pointer-events-none p-4">
                <motion.div
                  layoutId={`card-${cardId}`}
                  className="relative w-[90vw] max-w-6xl max-h-[88vh] flex flex-col bg-muted backdrop-blur-md border border-border/40 overflow-hidden shadow-2xl p-2 pointer-events-auto"
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                >
                  {/* Close button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.15 } }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                    onClick={() => setIsOpen(false)}
                    className="absolute right-2 top-2 h-fit w-fit rounded-lg bg-background/90 backdrop-blur-xl border border-border/40 p-1.5 shadow-lg z-50"
                    aria-label="Close"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4 text-muted-foreground" />
                  </motion.button>

                  {/* Inner wrapper */}
                  <div className="flex flex-col flex-1 min-h-0 bg-background rounded-2xl overflow-hidden border border-border/40">
                    {/* Scrollable image gallery */}
                    <div
                      ref={scrollRef}
                      className="relative flex-1 min-h-0 overflow-y-auto scroll-smooth"
                      style={{ scrollSnapType: "y mandatory" }}
                    >
                      {galleryImages.map((img, i) => (
                        <div
                          key={i}
                          className="relative w-full"
                          style={{ scrollSnapAlign: "start" }}
                        >

                          <img
                            src={img}
                            alt={`${site.name} screenshot ${i}`}
                            className="w-full object-cover"
                            loading="lazy"
                          />
                          {/* Image number label */}
                          <div className="absolute top-3 left-3">
                            <span className="text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                              {i + 1} / {galleryImages.length}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Dot nav */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-20">
                        {galleryImages.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => scrollToImage(i)}
                            className={`w-1.5 rounded-full transition-all duration-300 ${activeIndex === i
                              ? "h-5 bg-white shadow-md"
                              : "h-1.5 bg-white/40 hover:bg-white/70"
                              }`}
                            aria-label={`Go to screenshot ${i + 1}`}
                          />
                        ))}
                      </div>

                      {/* Scroll hint */}
                      {showScrollHint && galleryImages.length > 1 && (
                        <div className="sticky bottom-4 left-1/2 -translate-x-1/2 w-fit z-20 pointer-events-none animate-bounce mx-auto">
                          <div className="flex flex-col items-center gap-1 text-white/70">
                            <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4" />
                            <span className="text-[10px] font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">
                              Scroll for more
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom bar */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.2 } }}
                      exit={{ opacity: 0, y: 8, transition: { duration: 0.1 } }}
                      className="shrink-0 border-t border-border/60 bg-card/95 backdrop-blur-sm px-5 py-3.5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Favicon */}
                        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-linear-to-br from-muted to-muted/50 border border-border/40 shrink-0 overflow-hidden">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${site.url}&sz=32`}
                            alt=""
                            className="h-5 w-5 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{site.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {site.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <PrimaryButton
                          as="a"
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          iconLeft={<HugeiconsIcon icon={LinkSquare02Icon} className="h-3 w-3" />}
                        >
                          Open
                        </PrimaryButton>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}