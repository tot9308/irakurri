"use client";

import * as React from "react";

interface StageProps {
  children: React.ReactNode;
  className?: string;
}

export function Stage({ children, className }: StageProps) {
  return (
    <div
      className={`relative flex items-center justify-center min-h-[400px] bg-neutral-100 rounded-3xl border-4 border-neutral-200 overflow-hidden ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
