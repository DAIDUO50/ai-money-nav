"use client";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";

export default function NavBar({ name }: { name: string | string[] }) {
  const t = useTranslations("site");
  const router = useRouter();

  return (
    <nav className="flex items-center gap-2 text-sm text-primary-400 py-2">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1 hover:text-primary-600 transition-colors cursor-pointer"
      >
        <Home size={16} />
        <span>{t("home")}</span>
      </button>
      <span>/</span>
      {(Array.isArray(name) ? name : [name]).map((n, i) => (
        <span key={i} className="text-default-500">{n}</span>
      ))}
    </nav>
  );
}
