import clsx from "clsx";

import ImageUpload from "./image-upload";

export default function SingleImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="bg-primary-100 px-3 py-2 rounded-lg col-span-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className={clsx("mt-3 mb-3")}>
        <ImageUpload
          value={value}
          onChange={(src) => {
            onChange(src);
          }}
        />
      </div>
      {value && (
        <p className="text-xs text-gray-500 mt-1 break-all">{value}</p>
      )}
    </div>
  );
}
