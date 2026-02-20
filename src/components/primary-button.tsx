import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "default" | "ghost" | "outline";

interface BaseProps {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

// Link-specific props
interface AsLinkProps extends BaseProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> {
  as: "a";
  href: string;
  external?: boolean;
}

// Button-specific props
interface AsButtonProps extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
  as?: "button";
  href?: never;
  external?: never;
}

type PrimaryButtonProps = AsLinkProps | AsButtonProps;

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-6 text-base gap-2.5",
};

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground " +
    "shadow-[0px_0px_10px_0px_rgba(255,255,255,0.15)_inset] " +
    "ring ring-inset ring-white/15 ring-offset-2 ring-offset-primary " +
    "hover:shadow-[0px_0px_22px_0px_rgba(255,255,255,0.35)_inset] " +
    "hover:ring-white/35",
  ghost:
    "bg-transparent text-primary hover:bg-primary/10 border border-transparent",
  outline:
    "bg-transparent text-primary border border-primary/40 hover:bg-primary/8 hover:border-primary/70",
};

const baseClasses =
  "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap";

export function PrimaryButton(props: PrimaryButtonProps) {
  const {
    children,
    size = "md",
    variant = "default",
    className,
    iconLeft,
    iconRight,
    loading = false,
    disabled = false,
  } = props;

  const classes = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    loading && "opacity-70 pointer-events-none",
    className
  );

  const content = (
    <>
      {loading ? (
        <svg
          className="animate-spin h-3.5 w-3.5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        iconLeft && <span className="shrink-0">{iconLeft}</span>
      )}
      <span>{children}</span>
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
      {!loading && (props as AsLinkProps).external && (
        <HugeiconsIcon icon={LinkSquare02Icon} className="h-3 w-3 shrink-0 opacity-70" />
      )}
    </>
  );

  if (props.as === "a") {
    const { as: _as, external, href, iconLeft: _l, iconRight: _r, loading: _ld, size: _s, variant: _v, ...anchorProps } = props;
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const { as: _as, iconLeft: _l, iconRight: _r, loading: _ld, size: _s, variant: _v, ...buttonProps } = props;
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...buttonProps}
    >
      {content}
    </button>
  );
}