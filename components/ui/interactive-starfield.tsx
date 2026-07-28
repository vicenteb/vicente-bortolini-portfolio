"use client";

import { useEffect, useRef } from "react";

type Star = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
  rotation: number;
};

type RGB = [number, number, number];

type InteractiveStarfieldProps = {
  particleCount?: number;
  interactionRadius?: number;
  particleColor?: string;
  activeColor?: string;
  speed?: number;
};

function hexToRgb(hex: string): RGB {
  const normalized = hex.trim().replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    return [88, 70, 202];
  }

  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ];
}

function lerpRgb(from: RGB, to: RGB, amount: number) {
  return `rgb(${Math.round(from[0] + (to[0] - from[0]) * amount)}, ${Math.round(
    from[1] + (to[1] - from[1]) * amount,
  )}, ${Math.round(from[2] + (to[2] - from[2]) * amount)})`;
}

export default function InteractiveStarfield({
  particleCount = 340,
  interactionRadius = 150,
  particleColor = "#5846CA",
  activeColor = "#D8D2FF",
  speed = 0.5,
}: InteractiveStarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const baseRgb = hexToRgb(particleColor);
    const activeRgb = hexToRgb(activeColor);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const radius = interactionRadius * (coarsePointer ? 1.28 : 1);
    const spring = 0.022 + speed * 0.068;
    const damping = 0.9 - speed * 0.13;
    const mouse = { x: -9999, y: -9999, active: false };
    const stars: Star[] = [];
    let influence = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let animationFrame = 0;
    let visible = true;
    let startTime = performance.now();

    const seedStars = () => {
      stars.length = 0;
      const responsiveCount = coarsePointer
        ? Math.round(particleCount * 0.72)
        : particleCount;

      for (let index = 0; index < responsiveCount; index += 1) {
        const ox = Math.random() * width;
        const oy = Math.random() * height;
        stars.push({
          ox,
          oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          radius: 0.75 + Math.random() * 1.35,
          alpha: 0.16 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      seedStars();
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const bounds = canvas.getBoundingClientRect();
      mouse.x = clientX - bounds.left;
      mouse.y = clientY - bounds.top;
      mouse.active = true;
    };

    const handlePointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };

    const deactivate = () => {
      mouse.active = false;
    };

    const drawRoundedParticle = (
      star: Star,
      activation: number,
      color: string,
      alpha: number,
    ) => {
      const velocity = Math.hypot(star.vx, star.vy);
      const rotation =
        velocity > 0.3
          ? Math.atan2(star.vy, star.vx) + Math.PI / 2
          : star.rotation;
      const particleWidth = star.radius * 2;
      const particleHeight = star.radius * 2 + activation * 18;
      const halfWidth = particleWidth / 2;
      const halfHeight = particleHeight / 2;
      const cornerRadius = Math.min(halfWidth, halfHeight);

      context.save();
      context.translate(star.x, star.y);
      context.rotate(rotation);
      context.globalAlpha = alpha;
      context.fillStyle = color;

      if (activation > 0.28) {
        context.shadowBlur = 6 + activation * 13;
        context.shadowColor = color;
      }

      context.beginPath();
      context.roundRect(
        -halfWidth,
        -halfHeight,
        particleWidth,
        particleHeight,
        cornerRadius,
      );
      context.fill();
      context.restore();
    };

    const draw = (now: number) => {
      if (document.hidden || !visible) {
        animationFrame = 0;
        return;
      }

      context.clearRect(0, 0, width, height);
      const elapsed = (now - startTime) / 1000;
      const active = mouse.active && !reducedMotion;

      influence = active
        ? Math.min(1, influence + 0.075)
        : Math.max(0, influence - 0.035);

      const radiusSquared = radius * radius;

      for (const star of stars) {
        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const distanceSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSquared);
        let activation = 0;

        if (influence > 0.01 && distanceSquared < radiusSquared) {
          activation = (1 - distance / radius) ** 2 * influence;
        }

        if (activation > 0.01 && distance > 0.1) {
          const repulsion = coarsePointer ? 2.25 : 1.9;
          star.vx += (dx / distance) * repulsion * activation;
          star.vy += (dy / distance) * repulsion * activation;
        }

        star.vx += (star.ox - star.x) * spring;
        star.vy += (star.oy - star.y) * spring;
        star.vx *= damping;
        star.vy *= damping;
        star.x += star.vx;
        star.y += star.vy;

        const twinkle = reducedMotion
          ? 0.5
          : Math.sin(elapsed * 1.35 + star.phase) * 0.5 + 0.5;
        const baseAlpha = star.alpha * (0.56 + twinkle * 0.44);
        const alpha = Math.min(1, baseAlpha + activation * (1 - baseAlpha));
        const color = lerpRgb(baseRgb, activeRgb, activation);

        drawRoundedParticle(star, activation, color, alpha);
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      animationFrame = window.requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
        if (visible && !document.hidden && animationFrame === 0) {
          startTime = performance.now();
          animationFrame = window.requestAnimationFrame(draw);
        }
      },
      { threshold: 0.01 },
    );

    const handleVisibility = () => {
      if (!document.hidden && visible && animationFrame === 0) {
        startTime = performance.now();
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    resize();

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", deactivate);
    window.addEventListener("pointercancel", deactivate);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", deactivate);
    window.addEventListener("touchcancel", deactivate);
    document.addEventListener("visibilitychange", handleVisibility);

    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerMove);
      window.removeEventListener("pointerleave", deactivate);
      window.removeEventListener("pointercancel", deactivate);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", deactivate);
      window.removeEventListener("touchcancel", deactivate);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [
    activeColor,
    interactionRadius,
    particleColor,
    particleCount,
    speed,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-starfield"
      aria-hidden="true"
    />
  );
}
