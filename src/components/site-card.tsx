"use client";

import type { SiteMetadata } from "@/content/sites";
import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon, ArrowUpRight01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
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

  const galleryImages = site.images?.length ? site.images : [site.thumbnail];
  const galleryItemClass =
    "relative w-full shrink-0 flex items-center justify-center rounded-xl overflow-hidden border border-border/40 bg-muted/40 px-2 py-4";
  const galleryBadgeWrapClass = "absolute top-3 left-3";
  const galleryBadgeClass =
    "inline-flex items-center justify-center h-5 px-3 md:h-7 md:min-w-[74px] md:px-2.5 text-[10px] font-medium text-white/85 bg-black/40 backdrop-blur-sm rounded-full";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(false);

  // Lock body scroll when desktop modal is open
  useEffect(() => {
    if (!isMobile) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        setActiveIndex(0);
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
    const el = scrollEl;
    if (!el) return;
    const updateFromScrollPosition = () => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      const bottomHideMargin = 360;

      const imgHeight = scrollHeight / galleryImages.length;
      const idx = Math.round(scrollTop / imgHeight);
      const clampedIdx = Math.min(Math.max(idx, 0), galleryImages.length - 1);
      setActiveIndex(clampedIdx);

      // Show hint only if there is still downward scrollable content.
      const canScrollDownMore = scrollTop + clientHeight < scrollHeight - bottomHideMargin;
      setShowScrollHint(galleryImages.length > 1 && canScrollDownMore);
    };

    el.addEventListener("scroll", updateFromScrollPosition, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      updateFromScrollPosition();
    });
    resizeObserver.observe(el);

    // Run after layout/image sizing settles.
    const rafId = requestAnimationFrame(updateFromScrollPosition);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      el.removeEventListener("scroll", updateFromScrollPosition);
    };
  }, [galleryImages.length, scrollEl]);

  const scrollToImage = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const imgHeight = el.scrollHeight / galleryImages.length;
    el.scrollTo({ top: imgHeight * index, behavior: "smooth" });
  };



  /* ── Shared gallery content ── */
  const galleryContent = (
    <div
      ref={(node) => {
        scrollRef.current = node;
        setScrollEl(node);
      }}
      className="relative flex-1 min-h-0 overflow-y-auto scroll-smooth flex flex-col gap-2"
    >
      {galleryImages.map((img, i) => {
        return (
          <div
            key={i}
            className={galleryItemClass}
            style={{ scrollSnapAlign: "start" }}
          >
            <img
              src={img}
              alt={`${site.name} screenshot ${i}`}
              className="max-w-full max-h-[85vh] object-contain w-auto mx-auto"
              loading="lazy"
            />
            {/* Image number label */}
            <div className={galleryBadgeWrapClass}>
              <span className={galleryBadgeClass}>
                {i + 1} / {galleryImages.length}
              </span>
            </div>
          </div>
        );
      })}

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
    <div className="shrink-0 backdrop-blur-sm pt-2 flex items-center justify-between gap-4 pb-2 sm:pb-0 px-2 sm:px-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Favicon */}
        <div className="flex items-center justify-center pointer-events-none h-9 w-9 rounded-xl bg-linear-to-br from-muted to-muted/50 border border-border/40 shrink-0 overflow-hidden">
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
            fetchPriority="high"
            loading="eager"
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
        <a
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted cursor-pointer shrink-0"
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${site.name}`}
        >
          <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-3.5 w-3.5" />
        </a>
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
            className="group relative border border-border/40 bg-black/5 shadow-[inset_0_2px_5px_var(--color-neutral-300)] dark:shadow-[inset_0_2px_5px_var(--color-neutral-700)] backdrop-blur-lg dark:bg-white/5 cursor-pointer p-2 w-full text-left"
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
              <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 p-4">
                {galleryImages.map((img, i) => (
                  <div
                    key={i}
                    className={galleryItemClass}
                  >
                    <img
                      src={img}
                      alt={`${site.name} screenshot ${i}`}
                      className="max-w-full max-h-[85vh] object-contain w-auto mx-auto"
                      loading="lazy"
                    />
                    <div className={galleryBadgeWrapClass}>
                      <span className={galleryBadgeClass}>
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
            className="group relative border border-border/4 bg-black/5 shadow-[inset_0_2px_5px_var(--color-neutral-300)] dark:shadow-[inset_0_2px_5px_var(--color-neutral-700)] backdrop-blur-lg dark:bg-white/5 cursor-pointer p-2 w-full text-left"
          >
            {triggerContent}
          </MorphingDialogTrigger>

          <MorphingDialogContainer>
            <MorphingDialogContent className="relative w-[90vw] max-w-none h-[88vh] flex flex-col bg-muted/90 backdrop-blur-3xl border border-border/40 overflow-hidden p-2 rounded-none pointer-events-auto shadow-[inset_0_2px_5px_var(--color-neutral-300)] dark:shadow-[inset_0_2px_5px_var(--color-neutral-700)]">
              <MorphingDialogClose className="absolute right-3 top-3 z-50 flex items-center justify-center h-8 w-8 rounded-full bg-black/60 text-white/80 hover:bg-black/80 hover:text-white border border-white/10 shadow-md transition-all duration-150 active:scale-90 cursor-pointer focus:outline-none" />

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
