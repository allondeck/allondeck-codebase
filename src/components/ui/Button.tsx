import React from "react";
import { Link, LinkProps } from "react-router-dom";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  glow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export type ButtonProps = BaseButtonProps &
  (
    | (Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "element"> & { to?: never; href?: never })
    | (Omit<LinkProps, "to"> & { to: string; href?: never })
    | (Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; to?: never })
  );

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "rounded-[12px] bg-brand-orange text-white hover:bg-orange-600 font-semibold uppercase tracking-wider transition-all hover:scale-105 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark disabled:opacity-50 disabled:pointer-events-none",
  secondary:
    "rounded-[12px] bg-brand-dark-alt text-brand-cream border border-brand-medium/50 hover:bg-brand-medium/30 font-semibold uppercase tracking-wider transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark disabled:opacity-50 disabled:pointer-events-none",
  outline:
    "rounded-[12px] border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-semibold uppercase tracking-wider transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark disabled:opacity-50 disabled:pointer-events-none",
  ghost:
    "rounded-[12px] text-brand-cream/80 hover:text-brand-orange font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark disabled:opacity-50 disabled:pointer-events-none",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-5 lg:px-4 py-2.5 lg:py-2 text-xs min-h-[38px]",
  md: "px-7 lg:px-6 py-3.5 lg:py-2.5 text-sm min-h-[44px]",
  lg: "px-8 lg:px-8 py-4 lg:py-3 text-sm sm:text-base min-h-[48px]",
};

/**
 * Universal Button Primitive
 * Supports both standard <button> and React Router <Link to="..."> or standard <a> tags.
 */
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const combinedClasses = `inline-flex items-center justify-center whitespace-nowrap text-center ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

  if ("to" in props && props.to) {
    const { to, ...rest } = props as LinkProps & { to: string };
    return (
      <Link to={to} className={combinedClasses} {...rest}>
        {children}
      </Link>
    );
  }

  if ("href" in props && props.href) {
    const { href, ...rest } = props as React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <a href={href} className={combinedClasses} {...rest}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={combinedClasses} {...buttonProps}>
      {children}
    </button>
  );
}
