import { env, isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";

export type UploadedImage = { url: string; fileUrl?: string };

/**
 * Upload an image and get back a URL to store.
 *
 * Live backend: POST multipart/form-data to /garant/files/upload/single
 * Response: { fileUrl: "1.jpg" }
 *
 * Demo/mock mode: inlines the file as a data URL so the preview works without
 * a real backend. Note: no explicit Content-Type header — the browser sets the
 * multipart boundary itself.
 */
export async function uploadImage(file: File): Promise<UploadedImage> {
  if (isApiEnabled()) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(env.apiBaseUrl + "/files/upload/single", {
      method: "POST",
      headers: {
        "Accept-Language": "tk",
        ...(authToken() ? { Authorization: "Bearer " + authToken() } : {}),
      },
      body: form,
    });
    if (!res.ok) throw new Error("UPLOAD_FAILED");
    // API returns an envelope: { statusCode, success, data: { fileUrl: "..." } }
    // Handle both nested envelope and flat shapes for safety.
    const json = (await res.json()) as {
      fileUrl?: string;
      url?: string;
      data?: { fileUrl?: string; url?: string };
    };
    const fileUrl =
      json?.data?.fileUrl ?? json?.data?.url ?? json?.fileUrl ?? json?.url ?? "";
    return { url: fileUrl, fileUrl };
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("READ_FAILED"));
    reader.readAsDataURL(file);
  });
  return { url: dataUrl };
}
