"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "small" | "medium" | "large";

export type PortfolioButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export const PortfolioButton = forwardRef<HTMLButtonElement, PortfolioButtonProps>(
  function PortfolioButton({
    variant = "primary",
    size = "medium",
    loading = false,
    fullWidth = false,
    iconOnly = false,
    leadingIcon,
    trailingIcon,
    disabled = false,
    className = "",
    children,
    type = "button",
    ...props
  }, ref) {
    const classes = [
      "portfolio-button",
      "portfolio-button--" + variant,
      "portfolio-button--" + size,
      loading ? "is-loading" : "",
      fullWidth ? "is-full-width" : "",
      iconOnly ? "is-icon-only" : "",
      className,
    ].filter(Boolean).join(" ");

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
      >
        {loading ? (
          <>
            <svg className="portfolio-button-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 12a8 8 0 1 1-8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Processando…</span>
          </>
        ) : (
          <>
            {leadingIcon && <span className="portfolio-button-icon" aria-hidden="true">{leadingIcon}</span>}
            {!iconOnly && <span className="portfolio-button-label">{children}</span>}
            {trailingIcon && <span className="portfolio-button-icon portfolio-button-trailing" aria-hidden="true">{trailingIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

export function ArrowUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
