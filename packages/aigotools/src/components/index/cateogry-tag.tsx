import clsx from "clsx";
import { ReactNode } from "react";

export default function CategoryTag({
  children,
  onClick,
  active,
  className,
  variant,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "hot" | "new";
}) {
  const variantStyles = {
    default: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
    hot: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
    new: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
  };

  const activeVariantStyles = {
    default: "!from-blue-700 !to-purple-700",
    hot: "!from-orange-700 !to-red-700",
    new: "!from-green-700 !to-emerald-700",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-sm font-medium cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105",
        "active:scale-95",
        variantStyles[variant || "default"],
        {
          [activeVariantStyles[variant || "default"]]: active,
        },
        className,
      )}
      onClick={onClick}
    >
      {variant === "hot" && <span className="text-xs">🔥</span>}
      {variant === "new" && <span className="text-xs">✨</span>}
      {children}
    </span>
  );
}