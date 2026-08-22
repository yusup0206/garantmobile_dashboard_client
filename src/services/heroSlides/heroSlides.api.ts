import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { HERO_SLIDES } from "@/data/heroSlides.mock";
import type { HeroSlide, HeroSlideInput } from "./heroSlides.types";

/**
 * Hero slide store. With a real backend (VITE_API_BASE_URL set) it uses the
 * staff /hero-slides CRUD; otherwise the in-memory mock below powers the demo.
 * GET returns the HeroSlide shape 1:1 (nested Localized, numeric id, `old`);
 * requests flatten localized fields to the backend DTO (tag/tagTm, title/titleTm,
 * subtitle/subtitleTm, oldPrice).
 */
function toBody(input: HeroSlideInput) {
  return {
    tag: input.tag.ru,
    tagTk: input.tag.tm,
    title: input.title.ru,
    titleTk: input.title.tm,
    subtitle: input.subtitle.ru,
    subtitleTk: input.subtitle.tm,
    price: input.price,
    oldPrice: input.old,
    img: input.img,
    href: input.href,
    accent: input.accent,
    productId: input.productId,
    sortOrder: input.sortOrder,
    active: input.active,
  };
}

// --- Mock store (used when the API is not wired) -----------------------------

let store: HeroSlide[] = HERO_SLIDES.map((s) => ({ ...s }));
let nextId = Math.max(0, ...store.map((s) => s.id)) + 1;

export async function getHeroSlides(): Promise<HeroSlide[]> {
  if (isApiEnabled()) {
    return apiClient<HeroSlide[]>("/hero-slides", { token: authToken() });
  }
  return mockDelay(
    [...store].sort((a, b) => a.sortOrder - b.sortOrder).map((s) => ({ ...s })),
  );
}

export async function createHeroSlide(input: HeroSlideInput): Promise<HeroSlide> {
  if (isApiEnabled()) {
    return apiClient<HeroSlide>("/hero-slides", {
      method: "POST",
      token: authToken(),
      body: JSON.stringify(toBody(input)),
    });
  }
  const slide: HeroSlide = { ...input, id: nextId++ };
  store = [...store, slide];
  return mockDelay({ ...slide });
}

export async function updateHeroSlide(
  id: number,
  input: HeroSlideInput,
): Promise<HeroSlide> {
  if (isApiEnabled()) {
    return apiClient<HeroSlide>(`/hero-slides/${id}`, {
      method: "PUT",
      token: authToken(),
      body: JSON.stringify(toBody(input)),
    });
  }
  store = store.map((s) => (s.id === id ? { ...input, id } : s));
  const updated = store.find((s) => s.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function deleteHeroSlide(id: number): Promise<void> {
  if (isApiEnabled()) {
    await apiClient<void>(`/hero-slides/${id}`, {
      method: "DELETE",
      token: authToken(),
    });
    return;
  }
  store = store.filter((s) => s.id !== id);
  return mockDelay(undefined);
}
