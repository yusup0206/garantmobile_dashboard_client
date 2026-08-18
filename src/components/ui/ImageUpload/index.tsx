import { useRef, useState, useCallback, type DragEvent, type ChangeEvent } from "react";
import { uploadImage } from "@/services/files/files.api";
import { getImageUrl } from "@/lib/imageUrl";
import { cn } from "@/lib/cn";

type ImageUploadProps = {
  /** Current image URL (controlled value) */
  value?: string;
  /** Called with the uploaded fileUrl returned by the API */
  onChange: (url: string) => void;
  /** Optional label shown above the upload zone */
  label?: string;
  /** If true, disables interaction */
  disabled?: boolean;
  /** Accepted MIME types (default: image/*) */
  accept?: string;
};

type UploadState = "idle" | "uploading" | "error";

/**
 * Drop-zone image uploader.
 * – Click or drag a file onto it to upload.
 * – Shows a preview thumbnail of the current/uploaded image.
 * – Calls onChange(fileUrl) after a successful upload.
 */
export function ImageUpload({
  value,
  onChange,
  label,
  disabled,
  accept = "image/*",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleFile = useCallback(
    async (file: File) => {
      if (disabled) return;
      setUploadState("uploading");
      setErrorMsg("");
      try {
        const result = await uploadImage(file);
        onChange(result.url);
        setUploadState("idle");
      } catch {
        setUploadState("error");
        setErrorMsg("Ошибка загрузки. Попробуйте ещё раз.");
      }
    },
    [disabled, onChange],
  );

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  const isUploading = uploadState === "uploading";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-ink/70">{label}</label>
      )}

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
          "relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors",
          dragOver
            ? "border-brand bg-brand/5"
            : "border-line bg-canvas hover:border-brand/50 hover:bg-brand/5",
          isUploading && "pointer-events-none opacity-70",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={onInputChange}
          disabled={disabled}
        />

        {/* Preview */}
        {value ? (
          <div className="relative flex w-full flex-col items-center gap-2 p-3">
            <img
              src={getImageUrl(value)}
              alt="preview"
              className="max-h-32 max-w-full rounded-lg object-contain shadow-sm"
            />
            {!isUploading && (
              <span className="text-xs text-muted">
                Нажмите или перетащите, чтобы заменить
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 p-4 text-center">
            <UploadIcon />
            <p className="text-sm font-medium text-ink/70">
              {isUploading ? "Загрузка…" : "Нажмите или перетащите файл"}
            </p>
            {!isUploading && (
              <p className="text-xs text-muted">PNG, JPG, SVG, WEBP</p>
            )}
          </div>
        )}

        {/* Uploading spinner overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-canvas/70">
            <Spinner />
          </div>
        )}
      </div>

      {/* Error */}
      {uploadState === "error" && (
        <p className="text-xs text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      className="h-8 w-8 text-muted"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-7 w-7 animate-spin text-brand"
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
