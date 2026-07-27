"use client";

import { useEffect, useRef } from "react";

type Star = {
  originX: number;
  originY: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  opacity: number;
  phase: number;
  rotation: number;
};

const PURPLE = [88, 70, 202] as const;
const ACTIVE = [226, 221, 255] as const;

export default function InteractiveStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const pointer = { x: -9999, y: -9999, active: false };
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let influence = 0;
    let animationFrame = 0;
    let startTime = performance.now();

    const particleCount = coarsePointer ? 180 : 320;
    const interactionRadius = coarsePointer ? 175 : 145;
    const spring = 0.052;
    const damping = 0.83;

    const seedStars = () => {
      stars = Array.from({ length: particleCount }, () => {
        const originX = Math.random() * width;
        const originY = Math.random() * height;
        return {
          originX,
          originY,
          x: originX,
          y: originY,
          velocityX: 0,
          velocityY: 0,
          radius: 0.75 + Math.random() * 1.35,
          opacity: 0.16 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      seedStars();
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = clientX - bounds.left;
      pointer.y = clientY - bounds.top;
      pointer.active = true;
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };
    const onPointerDown = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const mixColor = (amount: number) =>
      `rgb(${Math.round(PURPLE[0] + (ACTIVE[0] - PURPLE[0]) * amount)}, ${Math.round(PURPLE[1] + (ACTIVE[1] - PURPLE[1]) * amount)}, ${Math.round(PURPLE[2] + (ACTIVE[2] - PURPLE[2]) * amount)})`;

    const draw = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      context.clearRect(0, 0, width, height);

      if (pointer.active && !reduceMotion) {
        influence = Math.min(1, influence + 0.075);
      } else {
        influence = Math.max(0, influence - 0.035);
      }

      const radiusSquared = interactionRadius * interactionRadius;

      for (const star of stars) {
        const deltaX = star.x - pointer.x;
        const deltaY = star.y - pointer.y;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;
        const distance = Math.sqrt(distanceSquared);
        let activation = 0;

        if (influence > 0.01 && distanceSquared < radiusSquared) {
          activation =
            (1 - distance / interactionRadius) ** 2 * influence;
        }

        if (activation > 0.01 && distance > 0.1) {
          const repulsion = coarsePointer ? 2.25 : 1.9;
          star.velocityX +=
            (deltaX / distance) * repulsion * activation;
          star.velocityY +=
            (deltaY / distance) * repulsion * activation;
        }

        star.velocityX += (star.originX - star.x) * spring;
        star.velocityY += (star.originY - star.y) * spring;
        star.velocityX *= damping;
        star.velocityY *= damping;
        star.x += star.velocityX;
        star.y += star.velocityY;

        const twinkle = reduceMotion
          ? 0.5
          : Math.sin(elapsed * 1.35 + star.phase) * 0.5 + 0.5;
        const alpha = Math.min(
          1,
          star.opacity * (0.55 + twinkle * 0.45) +
            activation * (1 - star.opacity),
        );
        const speed = Math.hypot(star.velocityX, star.velocityY);
        const rotation =
          speed > 0.3
            ? Math.atan2(star.velocityY, star.velocityX) + Math.PI / 2
            : star.rotation;
        const widthSize = star.radius * 2;
        const heightSize = star.radius * 2 + activation * 18;
        const color = mixColor(activation);

        context.save();
        context.translate(star.x, star.y);
        context.rotate(rotation);
        context.globalAlpha = alpha;
        context.fillStyle = color;

        if (activation > 0.35) {
          context.shadowBlur = 6 + activation * 12;
          context.shadowColor = color;
        }

        const halfWidth = widthSize / 2;
        const halfHeight = heightSize / 2;
        const corner = Math.min(halfWidth, halfHeight);
        context.beginPath();
        context.roundRect(
          -halfWidth,
          -halfHeight,
          widthSize,
          heightSize,
          corner,
        );
        context.fill();
        context.restore();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerLeave, { passive: true });
    window.addEventListener("pointercancel", onPointerLeave, { passive: true });
    window.addEventListener("blur", onPointerLeave);

    resize();
    startTime = performance.now();
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerLeave);
      window.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-starfield"
      aria-hidden="true"
    />
  );
}
