"use client";

import type { SiteMetadata } from "@/content/sites";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon, ArrowUpRight01Icon, ArrowDown01Icon, NewTwitterIcon } from "@hugeicons/core-free-icons";
import { PrimaryButton } from "./primary-button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
} from "./ui/morphing-dialog";

interface SiteCardWithModalProps {
  site: SiteMetadata;
}

export function SiteCardWithModal({ site }: SiteCardWithModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

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

  // Lock body scroll when desktop modal is open
  useEffect(() => {
    if (!isMobile) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        setActiveIndex(0);
        setShowScrollHint(true);
      } else {
        document.body.style.overflow = "";
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

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



  /* ── Shared gallery content ── */
  const galleryContent = (
    <div
      ref={scrollRef}
      className="relative flex-1 min-h-0 overflow-y-auto scroll-smooth flex flex-col gap-2 p-1"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {galleryImages.map((img, i) => (
        <div
          key={i}
          className="relative w-full shrink-0 rounded-xl overflow-hidden border border-border/40"
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
  );

  /* ── Shared bottom bar ── */
  const bottomBar = (
    <div className="shrink-0 backdrop-blur-sm px-5 py-3.5 flex items-center justify-between gap-4">
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
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {site.socialLink && (
          <a
            href={site.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-9 w-9 rounded-xl border border-border/40 hover:bg-muted text-muted-foreground hover:text-primary transition-all"
          >
            <HugeiconsIcon icon={NewTwitterIcon} className="h-4 w-4" />
          </a>
        )}
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
    </div>
  );

  const triggerContent = (
    <>
      <div className="overflow-hidden rounded-2xl border border-border/40 shadow-sm"
      >
        {/* Shimmer top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        {/* Thumbnail — fills entire card */}
        <div className="relative aspect-4/3 md:aspect-16/10 overflow-hidden">
          <img
            src={site.thumbnail}
            alt={site.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Name label */}
      <div className="flex items-center justify-between px-2 pt-2">
        <h3 className="font-medium text-sm text-card-foreground leading-tight truncate">
          {site.name}
        </h3>
        {site.socialLink ? (
          <a
            href={site.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <HugeiconsIcon icon={NewTwitterIcon} className="h-3.5 w-3.5" />
          </a>
        ) : (
          <div
            className="text-muted-foreground hover:text-foreground transition-colors inline-block cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/sites/${site.slug}`, "_self");
            }}
          >
            <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          {/* ── Mobile: Bottom Drawer Trigger ── */}
          <motion.div
            onClick={() => setIsOpen(true)}
            className="group relative border border-border/40 bg-black/5 shadow-inner shadow-black/10 dark:shadow-white/10 backdrop-blur-lg dark:bg-white/5 cursor-pointer p-2 w-full text-left"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            {triggerContent}
          </motion.div>

          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent className="max-h-[85vh] flex flex-col w-full sm:max-w-[90vw]">
              <DrawerHeader className="pb-2">
                <DrawerTitle className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-linear-to-br from-muted to-muted/50 border border-border/40 shrink-0 overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${site.url}&sz=32`}
                      alt=""
                      className="h-4 w-4 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  {site.name}
                </DrawerTitle>
              </DrawerHeader>

              {/* Scrollable gallery */}
              <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 px-4 pb-2">
                {galleryImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-full shrink-0 rounded-xl overflow-hidden border border-border/40"
                  >
                    <img
                      src={img}
                      alt={`${site.name} screenshot ${i}`}
                      className="w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        {i + 1} / {galleryImages.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom action */}
              {bottomBar}
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        /* ── Desktop: Morphing Dialog ── */
        <MorphingDialog
          transition={{
            type: "spring",
            bounce: 0,
            duration: 0.3,
          }}
        >
          <MorphingDialogTrigger
            className="group relative border border-border/40 bg-black/5 shadow-inner shadow-black/10 dark:shadow-white/10 backdrop-blur-lg dark:bg-white/5 cursor-pointer p-2 w-full text-left"
          >
            {triggerContent}
          </MorphingDialogTrigger>

          <MorphingDialogContainer>
            <MorphingDialogContent className="relative w-[90vw] max-w-none h-[88vh] flex flex-col bg-muted/90 backdrop-blur-3xl border border-border/40 overflow-hidden shadow-2xl p-2 rounded-none pointer-events-auto">
              <MorphingDialogClose className="absolute right-2 top-2 h-fit w-fit rounded-lg bg-background/50 backdrop-blur-xl border border-border/40 p-1.5 shadow-lg z-50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />

              <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                {galleryContent}
                {bottomBar}
              </div>
            </MorphingDialogContent>
          </MorphingDialogContainer>
        </MorphingDialog>
      )}
    </>
  );
}
