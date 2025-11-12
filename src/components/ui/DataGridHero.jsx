import React, { useEffect, useRef } from "react";

function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 27, g: 152, b: 224 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

/**
 * A generative hero component with animated grid background.
 *
 * Props:
 * - rows: number of rows
 * - cols: number of columns
 * - spacing: gap between cells (px)
 * - duration: animation duration (s)
 * - color: cell color (CSS string)
 * - animationType: "pulse" | "wave" | "random"
 * - pulseEffect: enable pulse animation
 * - mouseGlow: enable mouse-follow glow
 * - opacityMin: minimum opacity
 * - opacityMax: maximum opacity
 * - background: container background (CSS string)
 */
export default function DataGridHero({
  rows = 25,
  cols = 35,
  spacing = 4,
  duration = 5.0,
  color = "#1B98E0",
  animationType = "pulse",
  pulseEffect = true,
  mouseGlow = true,
  opacityMin = 0.05,
  opacityMax = 0.6,
  background = "transparent",
  children,
  className = "",
}) {
  const gridRef = useRef(null);

  // Build grid cells on cfg change
  useEffect(() => {
    const container = gridRef.current;
    if (!container) return;

    container.innerHTML = "";
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    container.style.gap = `${spacing}px`;
    container.style.setProperty("--mouse-glow-opacity", mouseGlow ? 1 : 0);

    const total = rows * cols;
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);

    for (let i = 0; i < total; i++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      const rgb = hexToRgb(color);
      cell.style.backgroundColor = color;
      cell.style.setProperty("--opacity-min", opacityMin);
      cell.style.setProperty("--opacity-max", opacityMax);
      cell.style.setProperty("--glow-color", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`);

      if (pulseEffect) {
        let delay;
        const r = Math.floor(i / cols);
        const c = i % cols;

        if (animationType === "wave") {
          delay = (r + c) * 0.1;
        } else if (animationType === "random") {
          delay = Math.random() * duration;
        } else {
          const dr = Math.abs(r - centerRow);
          const dc = Math.abs(c - centerCol);
          delay = Math.sqrt(dr * dr + dc * dc) * 0.2;
        }

        cell.style.animation = `cell-pulse ${duration}s infinite alternate`;
        cell.style.animationDelay = `${delay.toFixed(3)}s`;
      }

      container.appendChild(cell);
    }
  }, [
    rows,
    cols,
    spacing,
    color,
    animationType,
    pulseEffect,
    duration,
    opacityMin,
    opacityMax,
    mouseGlow,
  ]);

  // Mouse-follow glow
  useEffect(() => {
    if (!mouseGlow || !gridRef.current) return;
    const handler = (e) => {
      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gridRef.current.style.setProperty("--mouse-x", `${x}px`);
      gridRef.current.style.setProperty("--mouse-y", `${y}px`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseGlow]);

  return (
    <div className={`data-grid-hero ${className}`} style={{ background }}>
      <div
        ref={gridRef}
        className="grid-container"
        aria-hidden="true"
      />
      <div
        className="hero-content"
        role="region"
        aria-label="Hero Content"
      >
        {children}
      </div>
    </div>
  );
}

