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
        'max-w-5xl mx-auto p-2 border border-b-0 border-border/40 bg-muted/50 relative',
        className,
      )}
    >
      {/* Content layer */}
      <div className="border border-border/50 p-10 rounded-2xl bg-background relative z-10">
        {children}
      </div>
    </div>
  );
};