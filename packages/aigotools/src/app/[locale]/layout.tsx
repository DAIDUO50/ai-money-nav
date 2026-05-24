import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

import ThemeToastContainer from "@/components/common/theme-toast-container";
import AuthProvider from "@/components/common/auth-provider";
import { AppConfig } from "@/lib/config";
import UseQueryProvider from "@/components/common/use-query-provider";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale });

  const title = t("metadata.title");
  const description = t("metadata.description");
  const siteUrl = AppConfig.siteUrl || "http://localhost:3000";

  return {
    title: {
      template: `%s | ${AppConfig.siteName}`,
      default: title,
    },
    description,
    keywords: t("metadata.keywords"),
    generator: AppConfig.appGenerator,
    applicationName: AppConfig.siteName,
    authors: [{ name: AppConfig.appGenerator, url: AppConfig.appGeneratorUrl }],
    creator: AppConfig.appGenerator,
    publisher: AppConfig.appGenerator,
    icons: {
      icon: "/favicon.ico",
      apple: "/logo.png",
    },
    openGraph: {
      type: "website",
      locale: locale === "cn" ? "zh_CN" : "en_US",
      url: siteUrl,
      siteName: AppConfig.siteName,
      title: t("metadata.ogTitle"),
      description: t("metadata.ogDescription"),
      images: [{ url: `${siteUrl}/logo.png`, width: 512, height: 512, alt: AppConfig.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.ogTitle"),
      description: t("metadata.ogDescription"),
      images: [`${siteUrl}/logo.png`],
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <AuthProvider>
      <html lang={locale === "cn" ? "zh-CN" : locale}>
        <body>
          <main className="text-primary">
            <NextIntlClientProvider messages={messages}>
              <NextUIProvider aria-disabled>
                <ThemeProvider attribute="class">
                  <UseQueryProvider>{children}</UseQueryProvider>
                  <ThemeToastContainer />
                </ThemeProvider>
              </NextUIProvider>
            </NextIntlClientProvider>
          </main>
        </body>
      </html>
    </AuthProvider>
  );
}
