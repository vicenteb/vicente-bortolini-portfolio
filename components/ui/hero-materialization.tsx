"use client";

import { type ReactNode, useEffect, useRef } from "react";

type HeroMaterializationProps = {
  children: ReactNode;
};

type TextParticle = {
  targetX: number;
  targetY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

export default function HeroMaterialization({
  children,
}: HeroMaterializationProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", {
      alpha: true,
      willReadFrequently: true,
    });

    if (!heading || !canvas || !context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const particles: TextParticle[] = [];
    const pointer: PointerState = { x: -9999, y: -9999, active: false };
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let influence = 0;
    let animationFrame = 0;
    let cancelled = false;

    const addTextParticles = (
      node: Node | null | undefined,
      element: Element | null,
      color: string,
      maskContext: CanvasRenderingContext2D,
      mask: HTMLCanvasElement,
      candidates: Array<{ x: number; y: number; color: string }>,
    ) => {
      const text = node?.textContent ?? "";
      if (!node || !element || !text) return;

      maskContext.clearRect(0, 0, width, height);
      const range = document.createRange();
      range.selectNodeContents(node);
      const bounds = range.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const letterSpacing = Number.parseFloat(style.letterSpacing) || 0;

      maskContext.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      maskContext.textBaseline = "alphabetic";
      maskContext.fillStyle = "#fff";

      const characters = Array.from(text);
      const characterWidths = characters.map(
        (character) => maskContext.measureText(character).width,
      );
      const metrics = maskContext.measureText(text);
      const measuredWidth =
        characterWidths.reduce((total, value) => total + value, 0) +
        letterSpacing * Math.max(0, characters.length - 1);
      const scaleX = measuredWidth > 0 ? bounds.width / measuredWidth : 1;
      const glyphHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const baseline =
        bounds.top +
        (bounds.height - glyphHeight) / 2 +
        metrics.actualBoundingBoxAscent;

      maskContext.save();
      maskContext.translate(bounds.left, baseline);
      maskContext.scale(scaleX, 1);

      let cursorX = 0;
      characters.forEach((character, index) => {
        maskContext.fillText(character, cursorX, 0);
        cursorX += characterWidths[index] + letterSpacing;
      });

      maskContext.restore();

      const imageData = maskContext.getImageData(
        0,
        0,
        mask.width,
        mask.height,
      ).data;
      const sampling = width < 760 ? 5 : 4;

      for (let y = 0; y < height; y += sampling) {
        for (let x = 0; x < width; x += sampling) {
          if (imageData[(y * width + x) * 4 + 3] > 96) {
            candidates.push({ x, y, color });
          }
        }
      }
    };

    const buildParticles = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const mask = document.createElement("canvas");
      mask.width = width;
      mask.height = height;
      const maskContext = mask.getContext("2d", {
        willReadFrequently: true,
      });
      if (!maskContext) return;

      const candidates: Array<{ x: number; y: number; color: string }> = [];
      const role = heading.querySelector(".role-emphasis");
      const secondLine = heading.querySelector(".hero-line");

      addTextParticles(
        heading.firstChild,
        heading,
        "#f4f2ed",
        maskContext,
        mask,
        candidates,
      );
      addTextParticles(
        role?.firstChild,
        role,
        "#6754df",
        maskContext,
        mask,
        candidates,
      );
      addTextParticles(
        secondLine?.firstChild,
        secondLine,
        "#d4d4d8",
        maskContext,
        mask,
        candidates,
      );

      const maximumParticles = width < 760 ? 520 : 900;
      const stride = Math.max(
        1,
        Math.ceil(candidates.length / maximumParticles),
      );
      const selected = candidates.filter((_, index) => index % stride === 0);
      const existing = particles.slice();

      particles.length = 0;
      selected.forEach((candidate, index) => {
        const previous = existing[index];
        particles.push({
          targetX: candidate.x,
          targetY: candidate.y,
          x: previous?.x ?? candidate.x,
          y: previous?.y ?? candidate.y,
          vx: previous?.vx ?? 0,
          vy: previous?.vy ?? 0,
          size: 0.85 + Math.random() * 1.15,
          color: candidate.color,
        });
      });
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const bounds = heading.getBoundingClientRect();
      const padding = Math.min(110, window.innerWidth * 0.1);
      pointer.x = clientX;
      pointer.y = clientY;
      pointer.active =
        clientX >= bounds.left - padding &&
        clientX <= bounds.right + padding &&
        clientY >= bounds.top - padding &&
        clientY <= bounds.bottom + padding;
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };

    const deactivate = () => {
      pointer.active = false;
    };

    const draw = () => {
      if (cancelled) return;

      context.clearRect(0, 0, width, height);
      influence = pointer.active
        ? Math.min(1, influence + 0.085)
        : Math.max(0, influence - 0.04);

      const interactionRadius = Math.min(150, width * 0.17);
      const radiusSquared = interactionRadius * interactionRadius;
      const headingBounds = heading.getBoundingClientRect();

      if (influence > 0.01) {
        const maskRadius = interactionRadius * (0.35 + influence * 0.65);
        const maskX = pointer.x - headingBounds.left;
        const maskY = pointer.y - headingBounds.top;
        const mask = `radial-gradient(circle ${maskRadius}px at ${maskX}px ${maskY}px, transparent 0%, transparent 56%, #000 100%)`;
        heading.style.maskImage = mask;
        heading.style.setProperty("-webkit-mask-image", mask);
      } else {
        heading.style.maskImage = "";
        heading.style.removeProperty("-webkit-mask-image");
      }

      particles.forEach((particle) => {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distanceSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSquared);
        let activation = 0;

        if (influence > 0.01 && distanceSquared < radiusSquared) {
          activation =
            (1 - distance / interactionRadius) ** 2 * influence;
        }

        if (activation > 0.01 && distance > 0.1) {
          const force = 3.2 * activation;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }

        particle.vx += (particle.targetX - particle.x) * 0.055;
        particle.vy += (particle.targetY - particle.y) * 0.055;
        particle.vx *= 0.82;
        particle.vy *= 0.82;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const velocity = Math.hypot(particle.vx, particle.vy);
        const displacement = Math.hypot(
          particle.x - particle.targetX,
          particle.y - particle.targetY,
        );
        const particleVisibility = Math.min(
          1,
          activation * 5 + velocity * 0.16 + displacement * 0.06,
        );

        if (particleVisibility < 0.025) return;

        const particleWidth = particle.size * 2;
        const particleHeight =
          particle.size * 2 + activation * 18;
        const halfWidth = particleWidth / 2;
        const halfHeight = particleHeight / 2;
        const cornerRadius = Math.min(halfWidth, halfHeight);
        const rotation =
          velocity > 0.2
            ? Math.atan2(particle.vy, particle.vx) + Math.PI / 2
            : 0;

        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(rotation);
        context.globalAlpha = particleVisibility;
        context.fillStyle = particle.color;

        if (activation > 0.28) {
          context.shadowBlur = 6 + activation * 13;
          context.shadowColor = particle.color;
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
      });

      canvas.style.opacity = "1";
      heading.style.opacity = "1";
      animationFrame = window.requestAnimationFrame(draw);
    };

    const start = async () => {
      await Promise.race([
        document.fonts.ready,
        new Promise<void>((resolve) => window.setTimeout(resolve, 1200)),
      ]);
      if (cancelled) return;
      buildParticles();
      animationFrame = window.requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(buildParticles);
    resizeObserver.observe(heading);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", deactivate);
    window.addEventListener("pointercancel", deactivate);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", deactivate);
    window.addEventListener("touchcancel", deactivate);
    start().catch(() => {
      heading.style.opacity = "1";
      canvas.style.opacity = "0";
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      heading.style.opacity = "";
      heading.style.maskImage = "";
      heading.style.removeProperty("-webkit-mask-image");
      canvas.style.opacity = "";
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", deactivate);
      window.removeEventListener("pointercancel", deactivate);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", deactivate);
      window.removeEventListener("touchcancel", deactivate);
    };
  }, []);

  return (
    <>
      <h1 ref={headingRef} id="home-title">
        {children}
      </h1>
      <canvas
        ref={canvasRef}
        className="hero-materialization-canvas"
        aria-hidden="true"
      />
    </>
  );
}
