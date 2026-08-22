import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { DEFAULT_LAYOUT, HOME_LAYOUT_VERSION } from "./home.types";
import type { HomeBlock, HomeLayout } from "./home.types";

/**
 * Home layout store. With a real backend (VITE_API_BASE_URL set) it reads/writes
 * GET/PUT /home-layout; otherwise it uses the in-memory mock below so the demo
 * works offline. GET returns nested title/subtitle already (matches HomeBlock);
 * PUT flattens to the backend's DTO.
 */

/** HomeBlock (nested Localized) → PUT /home-layout block DTO (flat). */
function toInput(block: HomeBlock) {
  return {
    // A new block has a temporary negative id — omit it so the backend creates it.
    id: block.id > 0 ? block.id : undefined,
    kind: block.kind,
    visible: block.visible,
    title: block.title.ru,
    titleTk: block.title.tm,
    subtitle: block.subtitle.ru,
    subtitleTk: block.subtitle.tm,
    categoryId: block.categoryId ?? undefined,
    props: block.props,
  };
}

// --- Mock store (used when the API is not wired) -----------------------------

let store: HomeBlock[] = DEFAULT_LAYOUT.blocks.map((b) => ({ ...b }));
let nextId = Math.max(0, ...store.map((b) => b.id)) + 1;
/** Staged (unpublished) blocks in demo mode; null = no draft. */
let draftStore: HomeBlock[] | null = null;

export function getHomeLayout(): Promise<HomeLayout> {
  if (isApiEnabled()) {
    return apiClient<HomeLayout>("/home-layout");
  }
  return mockDelay({
    version: HOME_LAYOUT_VERSION,
    blocks: store.map((b) => ({ ...b })),
  });
}

/**
 * Full replace (ADR-001): the incoming array *is* the new layout. Order is
 * renumbered 1..n from array position (ADR-003), mirroring the backend.
 */
export function saveHomeLayout(blocks: HomeBlock[]): Promise<HomeLayout> {
  if (isApiEnabled()) {
    return apiClient<HomeLayout>("/home-layout", {
      method: "PUT",
      token: authToken(),
      body: JSON.stringify({
        version: HOME_LAYOUT_VERSION,
        blocks: blocks.map(toInput),
      }),
    });
  }
  store = blocks.map((b, index) => ({
    ...b,
    id: b.id > 0 ? b.id : nextId++,
    order: index + 1,
  }));
  return mockDelay({
    version: HOME_LAYOUT_VERSION,
    blocks: store.map((b) => ({ ...b })),
  });
}

// --- Draft workflow ----------------------------------------------------------

export type DraftStatus = { hasDraft: boolean; updatedAt: string | null };

/** The staged draft (or the live layout when none is staged). */
export function getHomeDraft(): Promise<HomeLayout> {
  if (isApiEnabled()) {
    return apiClient<HomeLayout>("/home-layout/draft", { token: authToken() });
  }
  return mockDelay({
    version: HOME_LAYOUT_VERSION,
    blocks: (draftStore ?? store).map((b) => ({ ...b })),
  });
}

export function getHomeDraftStatus(): Promise<DraftStatus> {
  if (isApiEnabled()) {
    return apiClient<DraftStatus>("/home-layout/draft/status", {
      token: authToken(),
    });
  }
  return mockDelay({
    hasDraft: draftStore !== null,
    updatedAt: draftStore ? new Date().toISOString() : null,
  });
}

/** Save the draft without touching the live layout. */
export function saveHomeDraft(blocks: HomeBlock[]): Promise<HomeLayout> {
  if (isApiEnabled()) {
    return apiClient<HomeLayout>("/home-layout/draft", {
      method: "PUT",
      token: authToken(),
      body: JSON.stringify({
        version: HOME_LAYOUT_VERSION,
        blocks: blocks.map(toInput),
      }),
    });
  }
  draftStore = blocks.map((b, index) => ({
    ...b,
    id: b.id > 0 ? b.id : nextId++,
    order: index + 1,
  }));
  return mockDelay({
    version: HOME_LAYOUT_VERSION,
    blocks: draftStore.map((b) => ({ ...b })),
  });
}

/** Promote the draft to the live layout and clear it. */
export function publishHomeDraft(): Promise<HomeLayout> {
  if (isApiEnabled()) {
    return apiClient<HomeLayout>("/home-layout/publish", {
      method: "POST",
      token: authToken(),
    });
  }
  if (draftStore) {
    store = draftStore.map((b) => ({ ...b }));
    draftStore = null;
  }
  return mockDelay({
    version: HOME_LAYOUT_VERSION,
    blocks: store.map((b) => ({ ...b })),
  });
}

/** Issue a short-lived token for previewing the draft on the storefront. */
export function getHomePreviewToken(): Promise<{ token: string; expiresIn: number }> {
  if (isApiEnabled()) {
    return apiClient<{ token: string; expiresIn: number }>(
      "/home-layout/preview-token",
      { method: "POST", token: authToken() },
    );
  }
  return mockDelay({ token: "demo", expiresIn: 900 });
}

/** Discard the draft, reverting the editor to the live layout. */
export function discardHomeDraft(): Promise<HomeLayout> {
  if (isApiEnabled()) {
    return apiClient<HomeLayout>("/home-layout/draft", {
      method: "DELETE",
      token: authToken(),
    });
  }
  draftStore = null;
  return mockDelay({
    version: HOME_LAYOUT_VERSION,
    blocks: store.map((b) => ({ ...b })),
  });
}
