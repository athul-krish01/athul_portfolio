"use client";

import { useEffect, useRef } from "react";

interface DotGridSpotlightProps {
  className?: string;
  dotSpacing?: number;
  baseRadius?: number;
  activeRadius?: number;
  interactionRadius?: number;
  /** [r, g, b, a] */
  baseColor?: [number, number, number, number];
  /** [r, g, b, a] */
  activeColor?: [number, number, number, number];
}

// --color-stroke (#e5e5e5), near-opaque so the resting grid is visible but subtle.
const DEFAULT_BASE_COLOR: [number, number, number, number] = [229, 229, 229, 0.9];
// --color-ink (#181818), the dot grid's hover/spotlight tone.
const DEFAULT_ACTIVE_COLOR: [number, number, number, number] = [24, 24, 24, 0.5];

/**
 * Canvas-driven dot grid: a resting grid of dots that brighten and enlarge
 * near the pointer, easing back once it moves away. Sized off its parent
 * element (not a fixed canvas) so it reflows with the container at any
 * viewport width, and honors prefers-reduced-motion by skipping the
 * animation loop and redrawing once per pointer move instead.
 */
export function DotGridSpotlight({
  className,
  dotSpacing = 28,
  baseRadius = 1,
  activeRadius = 2.5,
  interactionRadius = 140,
  baseColor = DEFAULT_BASE_COLOR,
  activeColor = DEFAULT_ACTIVE_COLOR,
}: DotGridSpotlightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dots: { x: number; y: number; radius: number; t: number }[] = [];
    const mouse = { x: -9999, y: -9999 };

    const buildGrid = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / dotSpacing) + 1;
      const rows = Math.ceil(height / dotSpacing) + 1;
      dots = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.push({ x: col * dotSpacing, y: row * dotSpacing, radius: baseRadius, t: 0 });
        }
      }
    };

    const lerpColor = (t: number) => {
      const r = baseColor[0] + (activeColor[0] - baseColor[0]) * t;
      const g = baseColor[1] + (activeColor[1] - baseColor[1]) * t;
      const b = baseColor[2] + (activeColor[2] - baseColor[2]) * t;
      const a = baseColor[3] + (activeColor[3] - baseColor[3]) * t;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const dot of dots) {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / interactionRadius);
        const target = proximity * proximity;
        dot.t += (target - dot.t) * 0.15;
        dot.radius = baseRadius + (activeRadius - baseRadius) * dot.t;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = lerpColor(dot.t);
        ctx.fill();
      }
    };

    let rafId = 0;
    const loop = () => {
      draw();
      rafId = requestAnimationFrame(loop);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      if (reduceMotion) draw();
    };

    const handlePointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      if (reduceMotion) draw();
    };

    buildGrid();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      buildGrid();
      draw();
    });
    resizeObserver.observe(parent);

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);

    if (!reduceMotion) {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [dotSpacing, baseRadius, activeRadius, interactionRadius, baseColor, activeColor]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
