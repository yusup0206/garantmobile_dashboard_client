import { useRef, useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useT } from "@/i18n/useT";
import { uploadImage } from "@/services/files/files.api";
import { getImageUrl } from "@/lib/imageUrl";

type ImageUploadFieldProps = {
  value: string;
  onChange: (url: string) => void;
  invalid?: boolean;
  placeholder?: string;
};

/**
 * A URL input plus an "upload" button and live preview. Uploading a file posts
 * it to the backend and fills the field with the returned URL; the URL can also
 * still be typed/pasted manually. Reused by the banner and hero-slide forms.
 */
export function ImageUploadField({
  value,
  onChange,
  invalid,
  placeholder,
}: ImageUploadFieldProps) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    setError(false);
    setUploading(true);
    try {
      const res = await uploadImage(file);
      onChange(res.url);
    } catch {
      setError(true);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          value={value}
          invalid={invalid}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://…"}
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onPick}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0"
        >
          <Upload className="h-4 w-4" />
          {uploading ? t("upload.uploading") : t("upload.button")}
        </Button>
      </div>
      {error ? <p className="text-xs text-red-600">{t("upload.err")}</p> : null}
      {value.trim() ? (
        <img
          src={getImageUrl(value)}
          alt=""
          className="h-24 w-full rounded-xl border border-line object-cover"
        />
      ) : null}
    </div>
  );
}
