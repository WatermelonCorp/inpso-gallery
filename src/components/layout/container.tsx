'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'max-w-7xl mx-auto p-2 border border-b-0 border-border/40 bg-black/5 backdrop-blur-xl shadow-[inset_0_2px_5px_var(--color-neutral-300)] dark:shadow-[inset_0_2px_5px_var(--color-neutral-700)] dark:bg-white/5 relative',
        className,
      )}
    >
      {/* Content layer */}
      <div className="border border-border/50 p-2 md:p-4 lg:p-10 rounded-2xl bg-background relative z-10 h-full min-h-0 flex flex-col">
        {children}
      </div>
    </div>
  );
};
