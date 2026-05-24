"use client";

import { ClerkProvider } from "@clerk/nextjs";

import { AppConfig } from "@/lib/config";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!AppConfig.isClerkEnabled) {
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
