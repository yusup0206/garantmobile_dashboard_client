import { env, isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";

export type UploadedImage = { url: string; path?: string; filename?: string };

/**
 * Upload an image and get back a URL to store (e.g. a banner's `img`). Against a
 * live backend it posts multipart/form-data to /files/image; in demo mode it
 * inlines the file as a data URL so the preview works and survives in the mock
 * stores. Note: no explicit Content-Type — the browser sets the multipart
 * boundary itself.
 */
export async function uploadImage(file: File): Promise<UploadedImage> {
  if (isApiEnabled()) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(env.apiBaseUrl + "/files/image", {
      method: "POST",
      headers: authToken() ? { Authorization: "Bearer " + authToken() } : {},
      body: form,
    });
    if (!res.ok) throw new Error("UPLOAD_FAILED");
    return (await res.json()) as UploadedImage;
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("READ_FAILED"));
    reader.readAsDataURL(file);
  });
  return { url: dataUrl };
}
