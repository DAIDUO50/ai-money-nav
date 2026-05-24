"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, PenTool, Palette, Video, Briefcase, DollarSign, Home, ChevronDown } from "lucide-react";
import clsx from "clsx";

import Container from "./container";
import Logo from "./logo";
import HeaderActions from "./header-actions";

import { Link } from "@/navigation";

const NAV_ITEMS = [
  { key: "home", href: "/", icon: Home },
  { 
    key: "aiWriting", 
    href: "/search?c=AI写作", 
    icon: PenTool,
    children: [
      { key: "generalChat", href: "/search?c=AI写作&sub=通用对话" },
      { key: "marketingCopy", href: "/search?c=AI写作&sub=营销文案" },
      { key: "academic", href: "/search?c=AI写作&sub=学术辅助" },
    ]
  },
  { key: "aiImage", href: "/search?c=AI绘图", icon: Palette },
  { key: "aiVideo", href: "/search?c=AI视频", icon: Video },
  { key: "aiOffice", href: "/search?c=AI办公", icon: Briefcase },
  { key: "aiMoney", href: "/search?c=AI赚钱", icon: DollarSign },
];

export default function Header({ className }: { className?: string }) {
  const t = useTranslations("header");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary-100">
      <Container
        className={clsx(
          "flex items-center justify-between h-16 sm:h-20 gap-4",
          className,
        )}
      >
        <Logo />

        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center">
          {NAV_ITEMS.map((item) => (
            <div 
              key={item.key} 
              className="relative"
              onMouseEnter={() => item.children && setDropdownOpen(item.key)}
              onMouseLeave={() => setDropdownOpen(null)}
            >
              <Link
                key={item.key}
                className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-900 transition-colors whitespace-nowrap px-3 py-2 rounded-lg hover:bg-primary-50"
                href={item.href}
              >
                <item.icon size={16} />
                <span>{t(`nav.${item.key}`)}</span>
                {item.children && <ChevronDown size={14} className="ml-0.5" />}
              </Link>
              
              {item.children && dropdownOpen === item.key && (
                <div className="absolute top-full left-0 mt-1 bg-background border border-primary-200 rounded-xl shadow-lg py-1 min-w-[140px] z-50">
                  {item.children.map((child) => (
                    <Link
                      key={child.key}
                      className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary-900 transition-colors whitespace-nowrap"
                      href={child.href}
                    >
                      {t(`nav.${child.key}`)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
          <HeaderActions locale={locale} />
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden p-2 text-primary-700"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {mobileOpen && (
        <div className="lg:hidden border-t border-primary-100 bg-background">
          <Container className="py-4 flex flex-col gap-4">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.key}>
                  <Link
                    key={item.key}
                    className="flex items-center gap-2 text-base font-medium text-primary-700 py-2 px-3 rounded-lg hover:bg-primary-50"
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon size={18} />
                    <span>{t(`nav.${item.key}`)}</span>
                  </Link>
                  {item.children && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.key}
                          className="block text-sm text-primary-600 py-1.5 px-3 rounded-lg hover:bg-primary-50"
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                        >
                          {t(`nav.${child.key}`)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="flex items-center gap-3 pt-2 border-t border-primary-100">
              <HeaderActions locale={locale} />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
