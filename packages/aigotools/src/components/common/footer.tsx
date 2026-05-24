"use client";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Divider, Link as NextUILink } from "@nextui-org/react";
import { Github, Twitter, MessageCircle } from "lucide-react";

import { AppConfig } from "@/lib/config";
import { Link } from "@/navigation";

import Container from "./container";
import Logo from "./logo";

export default function Footer({ className }: { className?: string }) {
  const t = useTranslations("footer");

  return (
    <footer className="bg-default-50 dark:bg-default-100 border-t border-default-200">
      <Container className={clsx(className, "py-8 sm:py-12")}>
        <Divider className="mb-8 sm:mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Us Section */}
          <div className="flex flex-col">
            <Logo className="text-lg sm:text-xl mb-3" />
            <div className="font-normal text-default-600 text-sm sm:text-base mb-2 leading-relaxed">
              {t("slogan")}
            </div>
            <div className="font-normal text-default-500 text-xs sm:text-sm">
              {t("tagline")}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-default-700 mb-2">{t("quickLinks")}</h3>
            <NextUILink 
              as={Link} 
              href="/#featured" 
              className="text-sm text-default-600 hover:text-primary-600 transition-colors"
            >
              {t("featured")}
            </NextUILink>
            <NextUILink 
              as={Link} 
              href="/#latest" 
              className="text-sm text-default-600 hover:text-primary-600 transition-colors"
            >
              {t("latestSubmit")}
            </NextUILink>
            <NextUILink 
              as={Link} 
              href="/categories" 
              className="text-sm text-default-600 hover:text-primary-600 transition-colors"
            >
              {t("allCategories")}
            </NextUILink>
            <NextUILink 
              as={Link} 
              href="/submit" 
              className="text-sm text-default-600 hover:text-primary-600 transition-colors"
            >
              ✨ {t("submitATool")}
            </NextUILink>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-default-700 mb-2">{t("followUs")}</h3>
            <div className="flex gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-default-600 hover:text-primary-600 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-default-600 hover:text-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <button 
                className="text-default-600 hover:text-primary-600 transition-colors"
                aria-label="WeChat"
                title="WeChat"
              >
                <MessageCircle size={20} />
              </button>
            </div>
            <div className="mt-4">
              <NextUILink 
                as={Link} 
                href="/about" 
                className="text-sm text-default-600 hover:text-primary-600 transition-colors"
              >
                {t("aboutUs")}
              </NextUILink>
            </div>
          </div>
        </div>
        
        <Divider className="mb-6" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-normal text-default-500 text-xs sm:text-sm">
            © {new Date().getFullYear()} {AppConfig.siteName}. {t("allRightsReserved")}
          </div>
          <div className="flex gap-4 text-xs text-default-500">
            <NextUILink 
              as={Link} 
              href="/privacy" 
              className="hover:text-primary-600 transition-colors"
            >
              {t("privacy")}
            </NextUILink>
            <NextUILink 
              as={Link} 
              href="/contact" 
              className="hover:text-primary-600 transition-colors"
            >
              {t("contactUs")}
            </NextUILink>
          </div>
        </div>
      </Container>
    </footer>
  );
}
