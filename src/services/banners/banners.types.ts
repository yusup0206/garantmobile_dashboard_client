/** Баннеры дашборда (ADR-004) — одна плоская сущность с контентом.
 *  Совпадает по форме с бэкендом (кроме id: строка в моке дашборда). */

export type Localized = { ru: string; tm: string };

export type BannerPlacement = "home" | "category" | "checkout";

/** Состояние публикации (ADR-004): расписание задаётся startsAt/endsAt. */
export type BannerStatusKey = "active" | "paused" | "draft";

/** Градиент подложки под фото баннера. */
export type BannerOverlay = "brand" | "dark";

export type Banner = {
  id: string;
  placement: BannerPlacement;
  order: number;
  img: string;
  kicker: Localized;
  title: Localized;
  ctaLabel: Localized;
  /** Внутренний путь витрины: /product/5, /catalog?cat=audio, /brand/Apple. */
  to: string;
  overlay: BannerOverlay;
  startsAt: string | null;
  endsAt: string | null;
  st: BannerStatusKey;
  /** Счётчик кликов — read-only, считает бэкенд. */
  clicks: number;
};

/** Payload для создания/обновления — всё, кроме id и накопленных clicks. */
export type BannerInput = Omit<Banner, "id" | "clicks">;
