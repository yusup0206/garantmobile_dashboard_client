/** Hero-слайды витрины (карусель на главной). Форма совпадает с ответом
 *  бэкенда GET /hero-slides; при сохранении локализованные поля разворачиваются
 *  в плоский DTO. */

export type Localized = { ru: string; tm: string };

export type HeroSlide = {
  id: number;
  tag: Localized;
  title: Localized;
  subtitle: Localized;
  price: number | null;
  old: number | null;
  img: string;
  href: string;
  accent: string;
  /** Товар, на который ведёт слайд (кнопки «Купить» / «Подробнее»). */
  productId: number | null;
  sortOrder: number;
  active: boolean;
};

export type HeroSlideInput = Omit<HeroSlide, "id">;
