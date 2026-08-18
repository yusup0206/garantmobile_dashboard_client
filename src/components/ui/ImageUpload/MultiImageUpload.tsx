import { useRef, useState, useCallback, type DragEvent, type ChangeEvent } from "react";
import { uploadMultipleImages } from "@/services/files/files.api";
import { getImageUrl } from "@/lib/imageUrl";
import { cn } from "@/lib/cn";
import { Plus, Trash2 } from "lucide-react";

type MultiImageUploadProps = {
  /** Current image URLs (controlled value) */
  value?: string[];
  /** Called with the array of uploaded fileUrls returned by the API */
  onChange: (urls: string[]) => void;
  /** Optional label shown above the upload zone */
  label?: string;
  /** If true, disables interaction */
  disabled?: boolean;
  /** Accepted MIME types (default: image/*) */
  accept?: string;
};

type UploadState = "idle" | "uploading" | "error";

export function MultiImageUpload({
  value = [],
  onChange,
  label,
  disabled,
  accept = "image/*",
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (disabled || files.length === 0) return;
      setUploadState("uploading");
      setErrorMsg("");
      try {
        const results = await uploadMultipleImages(files);
        const newUrls = results.map((r) => r.url).filter(Boolean);
        onChange([...value, ...newUrls]);
        setUploadState("idle");
      } catch {
        setUploadState("error");
        setErrorMsg("Ошибка загрузки картинок. Попробуйте ещё раз.");
      }
    },
    [disabled, onChange, value],
  );

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) handleFiles(files);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    if (files.length > 0) handleFiles(files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const isUploading = uploadState === "uploading";

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-semibold text-ink/70">{label}</label>
      )}

      {/* Grid of uploaded images + Add tile */}
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {value.map((url, index) => (
          <div
            key={url + index}
            className="group relative aspect-square rounded-xl border border-line bg-canvas overflow-hidden"
          >
            <img
              src={getImageUrl(url)}
              alt=""
              className="h-full w-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-lg bg-black/60 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                title="Удалить картинку"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}

        {/* Drop zone / Upload button */}
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
          onKeyDown={(e) =>
            e.key === "Enter" && !disabled && !isUploading && inputRef.current?.click()
          }
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={cn(
            "relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed transition-colors",
            dragOver
              ? "border-brand bg-brand/5"
              : "border-line bg-canvas hover:border-brand/50 hover:bg-brand/5",
            isUploading && "pointer-events-none opacity-70",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={accept}
            className="sr-only"
            onChange={onInputChange}
            disabled={disabled}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-1">
              <Spinner />
              <span className="text-[11px] text-muted">Загрузка…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center p-2">
              <Plus className="h-5 w-5 text-muted" />
              <span className="text-[11px] font-medium text-muted">
                Добавить фото
              </span>
            </div>
          )}
        </div>
      </div>

      {uploadState === "error" && (
        <p className="text-xs text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-brand"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
