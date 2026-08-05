import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { BANNERS } from "@/data/banners.mock";
import type { Banner, BannerInput } from "./banners.types";

/**
 * Banner store. With a real backend (VITE_API_BASE_URL set) it uses the staff
 * /banners CRUD; otherwise the in-memory mock below powers the demo. The backend
 * id is numeric — surfaced as a string here; localized fields are nested in
 * responses and flattened in requests to match the backend DTO.
 */

/** Backend GET /banners row — nested Localized, numeric id. */
type BannerRow = Omit<Banner, "id"> & { id: number };

const fromRow = (r: BannerRow): Banner => ({ ...r, id: String(r.id) });

/** BannerInput (nested Localized) → banner DTO (flat) the backend expects. */
function toBody(input: BannerInput) {
  return {
    placement: input.placement,
    order: input.order,
    img: input.img,
    kicker: input.kicker.ru,
    kickerTm: input.kicker.tm,
    title: input.title.ru,
    titleTm: input.title.tm,
    ctaLabel: input.ctaLabel.ru,
    ctaLabelTm: input.ctaLabel.tm,
    to: input.to,
    overlay: input.overlay,
    startsAt: input.startsAt ?? undefined,
    endsAt: input.endsAt ?? undefined,
    st: input.st,
  };
}

// --- Mock store (used when the API is not wired) -----------------------------

let store: Banner[] = BANNERS.map((b) => ({ ...b }));
let nextId = Math.max(0, ...store.map((b) => Number(b.id.replace("b-", "")))) + 1;

export async function getBanners(): Promise<Banner[]> {
  if (isApiEnabled()) {
    const rows = await apiClient<BannerRow[]>("/banners", { token: authToken() });
    return rows.map(fromRow);
  }
  return mockDelay(store.map((b) => ({ ...b })));
}

export async function createBanner(input: BannerInput): Promise<Banner> {
  if (isApiEnabled()) {
    const row = await apiClient<BannerRow>("/banners", {
      method: "POST",
      token: authToken(),
      body: JSON.stringify(toBody(input)),
    });
    return fromRow(row);
  }
  const banner: Banner = { ...input, id: "b-" + nextId++, clicks: 0 };
  store = [banner, ...store];
  return mockDelay({ ...banner });
}

export async function updateBanner(id: string, input: BannerInput): Promise<Banner> {
  if (isApiEnabled()) {
    const row = await apiClient<BannerRow>(`/banners/${id}`, {
      method: "PUT",
      token: authToken(),
      body: JSON.stringify(toBody(input)),
    });
    return fromRow(row);
  }
  store = store.map((b) => (b.id === id ? { ...input, id, clicks: b.clicks } : b));
  const updated = store.find((b) => b.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function deleteBanner(id: string): Promise<void> {
  if (isApiEnabled()) {
    await apiClient<void>(`/banners/${id}`, { method: "DELETE", token: authToken() });
    return;
  }
  store = store.filter((b) => b.id !== id);
  return mockDelay(undefined);
}
