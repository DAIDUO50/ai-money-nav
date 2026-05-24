"use client";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  useAuth,
  useUser,
} from "@clerk/nextjs";

import { ThemeSwitcher } from "./theme-switcher";
import LanguageSwitcher from "./language-switcher";

import { AppConfig } from "@/lib/config";
import { Link } from "@/navigation";

export default function HeaderActions({ locale }: { locale: string }) {
  const t = useTranslations("header");

  if (!AppConfig.isClerkEnabled) {
    return (
      <>
        <LanguageSwitcher />
        <ThemeSwitcher />
        <Link href="/submit">
          <Button className="font-semibold" color="primary" size="sm">
            {t("submit")}
          </Button>
        </Link>
      </>
    );
  }

  return <ClerkHeaderActions locale={locale} />;
}

function ClerkHeaderActions({ locale }: { locale: string }) {
  const t = useTranslations("header");
  const user = useUser();
  const { signOut } = useAuth();

  const isManager =
    user.user?.id && AppConfig.manageUsers.includes(user.user.id);

  const forceRedirectUrl =
    typeof window === "undefined"
      ? null
      : `${window.location.origin}/${locale}/submit`;

  return (
    <>
      <LanguageSwitcher />
      <ThemeSwitcher />
      <SignedOut>
        <SignInButton forceRedirectUrl={forceRedirectUrl} mode="modal">
          <Button className="font-semibold" color="primary" size="sm">
            {t("submit")}
          </Button>
        </SignInButton>
        <SignInButton mode="modal">
          <Button className="font-semibold hidden sm:flex" size="sm" variant="bordered">
            {t("login")}
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Link href="/submit">
          <Button className="font-semibold" color="primary" size="sm">
            {t("submit")}
          </Button>
        </Link>
        {isManager && (
          <Link href="/dashboard" target="_blank">
            <Button
              className="font-semibold hidden sm:flex"
              color="primary"
              size="sm"
              variant="bordered"
            >
              {t("dashboard")}
            </Button>
          </Link>
        )}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              alt={user.user?.fullName || ""}
              className="cursor-pointer"
              size="sm"
              src={user.user?.imageUrl}
            />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              key="logout"
              className="text-danger-400 hover:!text-danger-500"
              startContent={<LogOut size={14} strokeWidth={3} />}
              onClick={() => signOut()}
            >
              {t("logout")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </SignedIn>
    </>
  );
}
