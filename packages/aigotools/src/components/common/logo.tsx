"use client";
import clsx from "clsx";
import Image from "next/image";

import { AppConfig } from "@/lib/config";
import { Link } from "@/navigation";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link className="flex items-center gap-2 sm:gap-3 shrink-0 group" href="/">
      <Image
        alt={AppConfig.siteName}
        className="rounded-lg"
        height={36}
        src="/logo.png"
        width={36}
      />
      <span
        className={clsx(
          "font-bold text-base sm:text-xl leading-none whitespace-nowrap",
          "bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent",
          "group-hover:from-purple-600 group-hover:via-violet-600 group-hover:to-blue-600 transition-all duration-300",
          className,
        )}
      >
        {AppConfig.siteName}
      </span>
    </Link>
  );
}