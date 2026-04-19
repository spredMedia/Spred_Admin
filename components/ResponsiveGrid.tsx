"use client";

import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: "small" | "medium" | "large";
}

export function ResponsiveGrid({
  children,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
  gap = "medium",
}: ResponsiveGridProps) {
  const gapClasses = {
    small: "gap-2 md:gap-3",
    medium: "gap-3 md:gap-4",
    large: "gap-4 md:gap-6",
  };

  const gridColsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid",
        `grid-cols-${columns.mobile || 1}`,
        `md:grid-cols-${columns.tablet || 2}`,
        `lg:grid-cols-${columns.desktop || 4}`,
        gapClasses[gap]
      )}
    >
      {children}
    </div>
  );
}
