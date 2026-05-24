"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { History, SearchIcon, Trash2 } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import CategoryTag from "./cateogry-tag";

import { getFeaturedCategories } from "@/lib/actions";
import { Link, useRouter } from "@/navigation";
import Container from "@/components/common/container";

export default function Search({
  defaultSearch,
  category,
  className,
}: {
  defaultSearch?: string;
  category?: string;
  className?: string;
}) {
  const [value, setValue] = useState(defaultSearch || "");

  const router = useRouter();

  const t = useTranslations("index");

  const [histories, setHistories] = useState([] as string[]);

  const loadHistories = useCallback(() => {
    try {
      setHistories(JSON.parse(window.localStorage.getItem("histories") || ""));
    } catch {}
  }, []);

  const saveHistories = useCallback(
    (newRecord: string) => {
      window.localStorage.setItem(
        "histories",
        JSON.stringify([newRecord, ...histories].slice(10))
      );
      loadHistories();
    },
    [histories, loadHistories]
  );

  const clearHistories = useCallback(() => {
    window.localStorage.setItem("histories", JSON.stringify([]));
    loadHistories();
  }, [loadHistories]);

  useEffect(() => {
    loadHistories();
  }, [loadHistories]);

  const { data: featuredCategories = [] } = useQuery({
    queryKey: ["all-featured-categories"],
    async queryFn() {
      return await getFeaturedCategories();
    },
  });

  const history = histories.length ? (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <History
          className="text-primary-400 hover:text-default-foreground transition-all cursor-pointer"
          size={16}
          strokeWidth={3}
        />
      </DropdownTrigger>
      <DropdownMenu>
        {
          histories.map((item, index) => (
            <DropdownItem
              key={index}
              onClick={() => {
                setValue(item);
                router.push(`/search?s=${encodeURIComponent(item)}`);
              }}
            >
              {item}
            </DropdownItem>
          )) as any
        }
        <DropdownItem key="clear-history" onClick={() => clearHistories()}>
          <Button
            className="w-full"
            color="danger"
            size="sm"
            startContent={<Trash2 size={14} strokeWidth={3} />}
          >
            {t("clearAll")}
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : null;

  const hotSearches = [
    "ChatGPT",
    "Midjourney",
    "DALL-E",
    "Claude",
    "Gemini",
    "Stable Diffusion",
    "Sora",
    "Suno",
  ];

  const handleHotSearch = (term: string) => {
    setValue(term);
    saveHistories(term);
    let url = `/search?s=${encodeURIComponent(term)}`;
    if (category) {
      url += `&c=${encodeURIComponent(category)}`;
    }
    router.push(url);
  };

  return (
    <Container className={clsx("mt-6 sm:mt-10", className)}>
      <div className="max-w-[600px] mx-auto text-center relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveHistories(value);
            let url = `/search?s=${encodeURIComponent(value)}`;

            if (category) {
              url += `&c=${encodeURIComponent(category)}`;
            }
            router.push(url);
          }}
        >
          <Input
            classNames={{
              input:
                "text-center font-semibold placeholder:transition-all placeholder:text-primary-300 placeholder:font-semibold group-hover:placeholder:text-primary-400 group-data-[focus=true]:placeholder:text-primary-400",
              mainWrapper: "group",
              inputWrapper: "!border-primary-900 group-data-[focus=true]:border-transparent group-data-[focus=true]:bg-gradient-to-r group-data-[focus=true]:from-blue-500 group-data-[focus=true]:to-purple-500 group-data-[focus=true]:p-[2px] group-data-[focus=true]:rounded-full",
            }}
            endContent={history}
            placeholder={t("searchPlaceholder")}
            radius="full"
            size="lg"
            startContent={
              <SearchIcon
                className="text-primary-900 group-hover:text-primary-400 group-data-[focus=true]:text-default-foreground transition-all"
                size={16}
                strokeWidth={3}
              />
            }
            value={value}
            variant="bordered"
            onValueChange={setValue}
          />
        </form>
      </div>
      {/* Hot Search Tags */}
      <div className="mt-6 mb-4">
        <div className="text-sm text-default-500 mb-2">{t("hotSearch")}</div>
        <div className="flex flex-wrap justify-center gap-2">
          {hotSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleHotSearch(term)}
              className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:opacity-90 transition-all hover:scale-105 active:scale-95"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
      {featuredCategories.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {featuredCategories.map((item) => {
            return (
              <CategoryTag
                key={item._id}
                active={item.name === category}
                onClick={() => {
                  const url = `/search?s=${encodeURIComponent(
                    value
                  )}&c=${encodeURIComponent(item.name)}`;

                  router.push(url);
                }}
              >
                {[item.icon, item.name].filter(Boolean).join(" ")}
              </CategoryTag>
            );
          })}
          <Link href={"/categories"}>
            <CategoryTag>{t("more")}</CategoryTag>
          </Link>
        </div>
      )}
    </Container>
  );
}
