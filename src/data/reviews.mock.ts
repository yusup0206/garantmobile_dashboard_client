/**
 * Mock data layer for product reviews — mirrors the shape a moderation API
 * (services/reviews/*) would return from a backend.
 */
import type { Review, ReviewStatusKey } from "@/services/reviews/reviews.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const REVIEW_STATUS: Record<ReviewStatusKey, StatusMeta> = {
  published: { labelKey: "status.review.published", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  pending: { labelKey: "status.review.pending", fg: "#a86a1f", bg: "#fbf1e2", dot: "#e0a144" },
  rejected: { labelKey: "status.review.rejected", fg: "#b4453a", bg: "#fbecea", dot: "#e05a4a" },
};

export const REVIEWS: Review[] = [
  {
    id: 1,
    product: "iPhone 15 Pro Max 256 ГБ",
    author: "Мерет Аннаев",
    rating: 5,
    text: "Отличный телефон, камера снимает превосходно. Доставка быстрая.",
    date: "4 июл",
    st: "published",
  },
  {
    id: 2,
    product: "Samsung Galaxy S24 Ultra",
    author: "Гульнара Оразова",
    rating: 4,
    text: "Хороший экран и батарея, но немного тяжеловат в руке.",
    date: "3 июл",
    st: "published",
  },
  {
    id: 3,
    product: 'MacBook Air M3 13"',
    author: "Довлет Бердиев",
    rating: 5,
    text: "Быстрый и тихий ноутбук, идеально для работы и учёбы.",
    date: "3 июл",
    st: "pending",
  },
  {
    id: 4,
    product: "Xiaomi Redmi Note 13",
    author: "Айна Кулиева",
    rating: 3,
    text: "За свои деньги нормально, но прошивка иногда подвисает.",
    date: "2 июл",
    st: "pending",
  },
  {
    id: 5,
    product: "AirPods Pro 2",
    author: "Батыр Нурыев",
    rating: 5,
    text: "Шумоподавление на высоте, звук чистый и насыщенный.",
    date: "2 июл",
    st: "published",
  },
  {
    id: 6,
    product: 'iPad Air 11" M2',
    author: "Джерен Атаева",
    rating: 4,
    text: "Удобный планшет для рисования, экран яркий и отзывчивый.",
    date: "1 июл",
    st: "published",
  },
  {
    id: 7,
    product: "Sony WH-1000XM5",
    author: "Сердар Мурадов",
    rating: 2,
    text: "Ожидал большего, посадка неудобная, уши устают через час.",
    date: "1 июл",
    st: "rejected",
  },
  {
    id: 8,
    product: "iPhone 15 128 ГБ",
    author: "Огулджан Реджепова",
    rating: 5,
    text: "Всё как в описании, телефон новый, коробка запечатана.",
    date: "30 июн",
    st: "published",
  },
  {
    id: 9,
    product: 'Samsung QLED 55" 4K',
    author: "Максат Ходжаев",
    rating: 4,
    text: "Картинка сочная, но пульт мог бы быть поудобнее.",
    date: "30 июн",
    st: "pending",
  },
  {
    id: 10,
    product: "PlayStation 5 Slim",
    author: "Лейли Сапарова",
    rating: 1,
    text: "Пришёл с царапиной на корпусе, качеством упаковки недоволен.",
    date: "29 июн",
    st: "rejected",
  },
];
