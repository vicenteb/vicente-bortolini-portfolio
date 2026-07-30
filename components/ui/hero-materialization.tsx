"use client";

import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type HeroMaterializationProps = {
  children: ReactNode;
};

type Particle = {
  fromX: number;
  fromY: number;
  targetX: number;
  targetY: number;
  delay: number;
  size: number;
  phase: number;
  color: string;
  rotation: number;
};

const animationKey = "hero-materialization-seen";
const animationDuration = 1850;

const explosiveEase = (value: number) => 1 - (1 - value) ** 3;

export default function HeroMaterialization({
  children,
}: HeroMaterializationProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMaterializing, setIsMaterializing] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const alreadySeen = window.sessionStorage.getItem(animationKey) === "true";

    if (reducedMotion || alreadySeen) {
      const animationFrame = window.requestAnimationFrame(() => {
        setIsMaterializing(false);
      });

      return () => window.cancelAnimationFrame(animationFrame);
    }
  }, []);

  useEffect(() => {
    if (!isMaterializing) return;

    const heading = headingRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!heading || !canvas || !context) return;

    let animationFrame = 0;
    let cancelled = false;

    const start = async () => {
      await document.fonts.ready;
      if (cancelled) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
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

      const renderTextNode = (element: Element, text: string) => {
        const range = document.createRange();
        const node = element.firstChild;
        if (!node) return;
        range.selectNodeContents(node);
        const bounds = range.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const fontSize = Number.parseFloat(style.fontSize);

        maskContext.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        maskContext.textBaseline = "alphabetic";
        maskContext.fillStyle = "#fff";
        maskContext.fillText(text, bounds.left, bounds.bottom - fontSize * 0.13);
      };

      const firstTextNode = heading.firstChild;
      const role = heading.querySelector(".role-emphasis");
      const secondLine = heading.querySelector(".hero-line");

      if (firstTextNode?.textContent) {
        const range = document.createRange();
        range.selectNode(firstTextNode);
        const bounds = range.getBoundingClientRect();
        const style = window.getComputedStyle(heading);
        const fontSize = Number.parseFloat(style.fontSize);
        maskContext.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        maskContext.textBaseline = "alphabetic";
        maskContext.fillStyle = "#fff";
        maskContext.fillText(
          firstTextNode.textContent,
          bounds.left,
          bounds.bottom - fontSize * 0.13,
        );
      }

      if (role?.textContent) renderTextNode(role, role.textContent);
      if (secondLine?.textContent) renderTextNode(secondLine, secondLine.textContent);

      const imageData = maskContext.getImageData(0, 0, width, height).data;
      const candidates: Array<[number, number]> = [];
      const sampling = 5;

      for (let y = 0; y < height; y += sampling) {
        for (let x = 0; x < width; x += sampling) {
          if (imageData[(y * width + x) * 4 + 3] > 96) {
            candidates.push([x, y]);
          }
        }
      }

      const maximumParticles = width < 760 ? 420 : 720;
      const stride = Math.max(1, Math.ceil(candidates.length / maximumParticles));
      const headingBounds = heading.getBoundingClientRect();
      const centerX = headingBounds.left + headingBounds.width / 2;
      const centerY = headingBounds.top + headingBounds.height / 2;
      const particles: Particle[] = candidates
        .filter((_, index) => index % stride === 0)
        .map(([targetX, targetY]) => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 2 + Math.random() ** 2 * Math.min(30, width * 0.04);

          return {
            targetX,
            targetY,
            fromX: centerX + Math.cos(angle) * distance,
            fromY: centerY + Math.sin(angle) * distance,
            delay: Math.random() * 0.045,
            size: 0.8 + Math.random() * 1.35,
            phase: Math.random() * Math.PI * 2,
            color: Math.random() > 0.82 ? "#ddd8ff" : "#7867e7",
            rotation:
              Math.atan2(targetY - centerY, targetX - centerX) + Math.PI / 2,
          };
        });

      const startedAt = performance.now();

      const draw = (now: number) => {
        const rawProgress = Math.min(1, (now - startedAt) / animationDuration);
        context.clearRect(0, 0, width, height);
        context.globalCompositeOperation = "lighter";

        if (rawProgress < 0.58) {
          const ignition =
            rawProgress < 0.15
              ? rawProgress / 0.15
              : Math.max(0, 1 - (rawProgress - 0.15) / 0.43);
          const expansion = explosiveEase(Math.min(1, rawProgress / 0.58));
          const coreRadius = 12 + expansion * Math.min(105, width * 0.11);
          const glow = context.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            coreRadius,
          );
          glow.addColorStop(0, `rgba(238, 234, 255, ${ignition * 0.82})`);
          glow.addColorStop(0.18, `rgba(120, 103, 231, ${ignition * 0.48})`);
          glow.addColorStop(0.58, `rgba(88, 70, 202, ${ignition * 0.18})`);
          glow.addColorStop(1, "rgba(88, 70, 202, 0)");
          context.fillStyle = glow;
          context.fillRect(
            centerX - coreRadius,
            centerY - coreRadius,
            coreRadius * 2,
            coreRadius * 2,
          );

          if (rawProgress > 0.1) {
            const waveProgress = Math.min(1, (rawProgress - 0.1) / 0.42);
            context.globalAlpha = (1 - waveProgress) * 0.3;
            context.strokeStyle = "#7867e7";
            context.lineWidth = 1.2;
            context.beginPath();
            context.arc(
              centerX,
              centerY,
              18 + waveProgress * Math.min(145, width * 0.16),
              0,
              Math.PI * 2,
            );
            context.stroke();
          }
        }

        for (const particle of particles) {
          const localProgress = Math.min(
            1,
            Math.max(
              0,
              (rawProgress - 0.08 - particle.delay) /
                (0.72 - particle.delay),
            ),
          );
          const movement = explosiveEase(localProgress);
          const x =
            particle.fromX +
            (particle.targetX - particle.fromX) * movement;
          const y =
            particle.fromY +
            (particle.targetY - particle.fromY) * movement;
          const arrivalFade =
            rawProgress > 0.82 ? 1 - (rawProgress - 0.82) / 0.18 : 1;
          const alpha =
            Math.min(1, localProgress * 6) *
            Math.max(0, arrivalFade) *
            (0.68 + Math.sin(now * 0.0034 + particle.phase) * 0.12);
          context.save();
          context.translate(x, y);
          context.rotate(particle.rotation);
          context.globalAlpha = alpha;
          context.fillStyle = particle.color;
          context.beginPath();
          const particleWidth = particle.size * 2;
          const particleHeight =
            particle.size * 2 + (1 - movement) * particle.size * 5.5;
          context.roundRect(
            -particleWidth / 2,
            -particleHeight / 2,
            particleWidth,
            particleHeight,
            particle.size,
          );
          context.fill();
          context.restore();
        }
        context.globalCompositeOperation = "source-over";
        context.globalAlpha = 1;

        if (rawProgress < 1 && !cancelled) {
          animationFrame = window.requestAnimationFrame(draw);
          return;
        }

        window.sessionStorage.setItem(animationKey, "true");
        setIsMaterializing(false);
      };

      animationFrame = window.requestAnimationFrame(draw);
    };

    start();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
    };
  }, [isMaterializing]);

  return (
    <>
      <h1
        ref={headingRef}
        id="home-title"
        className={isMaterializing ? "is-materializing" : undefined}
      >
        {children}
      </h1>
      {isMaterializing && (
        <canvas
          ref={canvasRef}
          className="hero-materialization-canvas"
          aria-hidden="true"
        />
      )}
    </>
  );
}
