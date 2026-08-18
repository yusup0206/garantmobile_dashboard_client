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

/**
 * Upload multiple images and get back an array of URLs or fileUrls.
 *
 * Live backend: POST multipart/form-data to /garant/files/upload/multiple
 * Request body: multipart form data with "file" (or "files") field containing binary files
 * Response: { fileUrl: "1.jpg" } or array of fileUrls
 */
export async function uploadMultipleImages(
  files: File[],
  lang: string = "tk",
): Promise<UploadedImage[]> {
  if (files.length === 0) return [];

  if (isApiEnabled()) {
    const form = new FormData();
    files.forEach((file) => {
      form.append("files", file);
    });

    const res = await fetch(env.apiBaseUrl + "/files/upload/multiple", {
      method: "POST",
      headers: {
        "Accept-Language": lang,
        ...(authToken() ? { Authorization: "Bearer " + authToken() } : {}),
      },
      body: form,
    });

    if (!res.ok) throw new Error("MULTIPLE_UPLOAD_FAILED");

    // Handle responses: envelope { data: ... }, array of objects, single object, or array of strings
    const json = await res.json();
    const data = json && typeof json === "object" && "data" in json ? json.data : json;

    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === "string") return { url: item, fileUrl: item };
        const fileUrl = item?.fileUrl ?? item?.url ?? "";
        return { url: fileUrl, fileUrl };
      });
    }

    if (data && typeof data === "object") {
      const fileUrl = data.fileUrl ?? data.url ?? "";
      return [{ url: fileUrl, fileUrl }];
    }

    return [];
  }

  // Demo / mock mode fallback: convert all files to data URLs
  const dataUrls = await Promise.all(
    files.map(
      (file) =>
        new Promise<UploadedImage>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ url: String(reader.result) });
          reader.onerror = () => reject(new Error("READ_FAILED"));
          reader.readAsDataURL(file);
        }),
    ),
  );

  return dataUrls;
}

