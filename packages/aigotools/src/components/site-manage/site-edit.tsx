"use client";
import { useForm } from "react-hook-form";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

import LinksInput from "./links-input";

import { Site } from "@/models/site";
import ArrowInput from "@/components/common/arrow-input";
import SingleImageUpload from "@/components/common/single-image-upload";
import { managerSearchCategories, saveSite } from "@/lib/actions";

export default function SiteEdit({
  site,
  onClose,
}: {
  site?: Site;
  onClose: () => void;
}) {
  const { register, getValues, setValue, watch, reset, trigger, formState } =
    useForm<Site>({
      defaultValues: site,
    });

  const t = useTranslations("siteEdit");

  const formValues = watch();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    reset(site);
  }, [reset, site]);

  const onSubmit = useCallback(async () => {
    if (saving) return;

    try {
      if (!(await trigger("url"))) return;

      setSaving(true);
      const values = getValues();

      const savedSite = await saveSite(values);

      if (!savedSite) {
        toast.error(t("saveFailed"));
      } else {
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(t("saveFailed"));
    } finally {
      setSaving(false);
    }
  }, [saving, trigger, getValues, t, onClose]);

  const { data: categories = [] } = useQuery({
    queryKey: ["all-second-categories"],
    async queryFn() {
      const res = await managerSearchCategories({
        page: 1,
        size: 999,
        type: "second",
      });

      return res.categories;
    },
    initialData: [],
  });

  // If no site is selected, don't render anything
  if (!site) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {site._id ? t("updateTitle") : t("newTitle")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <form
            className="grid grid-cols-2 gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              isRequired
              label={t("url")}
              size="sm"
              value={formValues.url || ""}
              {...register("url", { required: true })}
              color={formState.errors.url ? "danger" : "default"}
            />
            <Input
              label={t("name")}
              size="sm"
              value={formValues.name || ""}
              {...register("name")}
            />
            <Input
              label={t("pricingType")}
              size="sm"
              value={formValues.pricingType || ""}
              {...register("pricingType")}
            />
            <div className="flex items-center justify-between py-3 rounded-lg px-3 bg-primary-100">
              <label className="text-sm">{t("featured")}</label>
              <Switch
                checked={!!formValues.featured}
                size="sm"
                onValueChange={(val) => setValue("featured", val)}
              />
            </div>
            <Input
              label={t("weight")}
              size="sm"
              value={String(formValues.weight ?? "")}
              onValueChange={(value) =>
                setValue("weight", parseInt(value, 10))
              }
            />
            <Select
              label={t("categories")}
              selectedKeys={
                (formValues.categories && Array.isArray(formValues.categories)
                  ? formValues.categories
                  : formState.defaultValues?.categories
                    ? [formState.defaultValues.categories]
                    : []
                ).filter((k): k is string => !!k)
              }
              selectionMode="multiple"
              size="sm"
              onSelectionChange={(value) => {
                setValue(
                  "categories",
                  Array.from(value).map((item) => item.toString())
                );
              }}
            >
              {categories.map((category: any) => (
                <SelectItem key={category._id}>{category.name}</SelectItem>
              ))}
            </Select>

            <ArrowInput
              label={t("features")}
              value={formValues.features || []}
              onChange={(value) => setValue("features", value)}
            />
            <ArrowInput
              label={t("pricings")}
              value={formValues.pricings || []}
              onChange={(value) => setValue("pricings", value)}
            />
            <LinksInput
              value={formValues.links || []}
              onChange={(value) => setValue("links", value)}
            />
            <ArrowInput
              label={t("usecases")}
              value={formValues.usecases || []}
              onChange={(value) => setValue("usecases", value)}
            />
            <ArrowInput
              label={t("relatedSearches")}
              value={formValues.relatedSearches || []}
              onChange={(value) => setValue("relatedSearches", value)}
            />
            <ArrowInput
              label={t("users")}
              value={formValues.users || []}
              onChange={(value) => setValue("users", value)}
            />
            <SingleImageUpload
              label={t("snapshot")}
              value={formValues.snapshot || ""}
              onChange={(value) => setValue("snapshot", value)}
            />

            <Textarea
              label={t("description")}
              size="sm"
              value={formValues.description || ""}
              {...register("description")}
              className="col-span-2"
            />
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-zinc-700">
          <Button color="primary" isLoading={saving} size="sm" onClick={onSubmit}>
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
