import clsx from "clsx";
import Image from "next/image";

import { AppConfig } from "@/lib/config";
import { Link } from "@/navigation";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link className="flex items-center gap-2 sm:gap-3 shrink-0" href="/">
      <Image
        alt={AppConfig.siteName}
        className="rounded-lg"
        height={36}
        src="/logo.png"
        width={36}
      />
      <span
        className={clsx(
          "text-primary-800 font-bold text-base sm:text-xl leading-none whitespace-nowrap",
          className,
        )}
      >
        {AppConfig.siteName}
      </span>
    </Link>
  );
}
