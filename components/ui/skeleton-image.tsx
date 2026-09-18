"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type CSSProperties, type PointerEventHandler } from "react";

type SkeletonImageProps = ImageProps & {
  containerClassName: string;
  containerStyle?: CSSProperties;
  imageClassName?: string;
  containerAriaLabel?: string;
  decorative?: boolean;
  onContainerPointerMove?: PointerEventHandler<HTMLDivElement>;
  onContainerPointerLeave?: PointerEventHandler<HTMLDivElement>;
};

export default function SkeletonImage({
  containerClassName,
  containerStyle,
  imageClassName,
  containerAriaLabel,
  decorative = false,
  onContainerPointerMove,
  onContainerPointerLeave,
  alt,
  ...imageProps
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`${containerClassName} media-skeleton${
        isLoaded ? " is-loaded" : ""
      }`}
      style={containerStyle}
      aria-hidden={decorative || undefined}
      aria-label={containerAriaLabel}
      role={containerAriaLabel ? "img" : undefined}
      onPointerMove={onContainerPointerMove}
      onPointerLeave={onContainerPointerLeave}
    >
      <span className="media-skeleton-placeholder" aria-hidden="true" />
      <Image
        {...imageProps}
        className={`${imageClassName ?? ""} media-skeleton-image`.trim()}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
