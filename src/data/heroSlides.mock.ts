import type { HeroSlide } from "@/services/heroSlides/heroSlides.types";

const img = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?w=1400&q=80&auto=format&fit=crop`;

/** Демо hero-слайды — зеркалят карусель витрины. */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    tag: { ru: "Весенний завоз флагманов", tm: "" },
    title: { ru: "iPhone 15 Pro Max", tm: "" },
    subtitle: {
      ru: "Титановый корпус, чип A17 Pro и камера 48 Мп. Уже в наличии в Ашхабаде.",
      tm: "",
    },
    price: 18900,
    old: 21500,
    img: img("1592750475338-74b7b21085ab"),
    href: "/product/1",
    accent: "#1B23D8",
    productId: 1,
    sortOrder: 0,
    active: true,
  },
  {
    id: 2,
    tag: { ru: "Новинка сезона", tm: "" },
    title: { ru: "Galaxy S24 Ultra", tm: "" },
    subtitle: {
      ru: "Galaxy AI, перо S Pen и зум 100×. Преимущество в каждой детали.",
      tm: "",
    },
    price: 22400,
    old: null,
    img: img("1610945415295-d9bbf067e59c"),
    href: "/product/2",
    accent: "#5a2a8a",
    productId: 2,
    sortOrder: 1,
    active: true,
  },
  {
    id: 3,
    tag: { ru: "Работа и творчество", tm: "" },
    title: { ru: "MacBook Air M3", tm: "" },
    subtitle: {
      ru: "Тонкий, тихий, до 18 часов работы. Мощность нового поколения.",
      tm: "",
    },
    price: 16900,
    old: 18200,
    img: img("1517336714731-489689fd1ca8"),
    href: "/product/8",
    accent: "#0a6",
    productId: 8,
    sortOrder: 2,
    active: false,
  },
];
