"use client";

import { useMemo } from "react";

export function Confetti({ count = 36 }: { count?: number }) {
  const pieces = useMemo(() => {
    const colors = ["#e63946", "#f4c542", "#2ec4b6", "#ff9f1c", "#9d4edd"];
    return Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 600,
      duration: 1800 + Math.random() * 1600,
      color: colors[i % colors.length],
      size: 8 + Math.random() * 8,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-30">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 animate-confetti rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            background: p.color,
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.duration}ms`,
          }}
        />
      ))}
    </div>
  );
}
