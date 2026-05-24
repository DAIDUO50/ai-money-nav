import createMiddleware from "next-intl/middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

import { localePrefix, locales } from "./navigation";
import { AvailableLocales } from "./lib/locales";
import { AppConfig } from "./lib/config";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: AvailableLocales[0],
  localePrefix: localePrefix,
});

const isManageRoute = createRouteMatcher(["/(.*)/dashboard"]);
const isUserRoute = createRouteMatcher(["/(.*)/submit"]);

function handleRequest(auth: any, req: NextRequest) {
  if (AppConfig.isClerkEnabled) {
    if (isUserRoute(req)) auth().protect();

    if (isManageRoute(req)) {
      const { userId, redirectToSignIn } = auth();

      if (!userId || !AppConfig.manageUsers.includes(userId)) {
        return redirectToSignIn();
      }
    }
  }

  const nextPathname = req.nextUrl.pathname;

  if (/^\/(api|trpc|sitemap)/.test(nextPathname)) {
    return;
  }

  return intlMiddleware(req);
}

export default AppConfig.isClerkEnabled
  ? clerkMiddleware(handleRequest, { debug: AppConfig.debugClerk })
  : (req: NextRequest) => {
      const nextPathname = req.nextUrl.pathname;

      if (/^\/(api|trpc|sitemap)/.test(nextPathname)) {
        return;
      }

      return intlMiddleware(req);
    };

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
