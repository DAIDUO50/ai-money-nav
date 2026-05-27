import { Plus, Trash2, Upload } from "lucide-react";
import { ChangeEvent, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

import { uploadFormDataToLocal } from "../../lib/local-storage";

import Loading from "./loading";

export default function ImageUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (uploading) return;

      try {
        setUploading(true);
        setError(null);

        const file = e.target.files?.[0];
        if (!file) return;

        console.log("Uploading file:", file.name, file.size, file.type);

        const formData = new FormData();
        formData.append("files", file);

        // Use local storage
        const res = await uploadFormDataToLocal(formData);
        console.log("Upload result:", res);

        if (res && res[0]) {
          onChange(res[0]);
          toast.success("图片上传成功");
        } else {
          throw new Error("上传返回为空");
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        setError(err.message || "上传失败");
        toast.error(t("uploadFailed") || "图片上传失败");
      } finally {
        setUploading(false);
        // Reset input so same file can be re-selected
        e.target.value = "";
      }
    },
    [onChange, t, uploading]
  );

  return (
    <div className="space-y-2">
      {/* Preview or Upload area */}
      {value ? (
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="preview"
              className="w-full h-full object-cover"
              src={value}
            />
            <button
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              onClick={() => onChange("")}
              type="button"
            >
              <Trash2 size={20} className="text-white" />
            </button>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 break-all">{value}</p>
            <button
              className="mt-1 text-xs text-primary-600 hover:text-primary-800"
              onClick={() => onChange("")}
              type="button"
            >
              删除图片
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-primary-300 hover:border-primary-500 bg-primary-50 hover:bg-primary-100 rounded-lg cursor-pointer transition-colors">
          <Upload size={24} className="text-primary-400 mb-1" />
          <span className="text-sm text-primary-600">点击上传图片</span>
          <span className="text-xs text-primary-400">支持 JPG、PNG、GIF</span>
          {uploading && <Loading isLoading size="sm" />}
          <input
            accept="image/*"
            className="hidden"
            disabled={uploading}
            type="file"
            onChange={handleUpload}
          />
        </label>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* Uploading indicator */}
      {uploading && !value && (
        <p className="text-xs text-primary-600">正在上传...</p>
      )}
    </div>
  );
}
