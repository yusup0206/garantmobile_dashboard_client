/**
 * Mock data layer for the blog feature — ported from the prototype's data
 * dictionary. In production, services/blog/* would return this shape from a
 * backend.
 */
import type { Post, PostStatusKey } from "@/services/blog/blog.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const POST_STATUS: Record<PostStatusKey, StatusMeta> = {
  published: { labelKey: "status.post.published", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  draft: { labelKey: "status.post.draft", fg: "#6d7c74", bg: "#eef2f0", dot: "#9aa8a1" },
  scheduled: { labelKey: "status.post.scheduled", fg: "#1f5f8b", bg: "#e6f1f8", dot: "#3b91d6" },
};

export const POSTS: Post[] = [
  {
    id: 1,
    title: "Как выбрать смартфон в 2026",
    author: "Мердан Аннаев",
    date: "3 июл",
    views: 12800,
    st: "published",
  },
  {
    id: 2,
    title: "Топ-5 ноутбуков для работы",
    author: "Гульнара Оразова",
    date: "2 июл",
    views: 8450,
    st: "published",
  },
  {
    id: 3,
    title: "Обзор iPhone 15 Pro Max",
    author: "Батыр Гельдиев",
    date: "1 июл",
    views: 21400,
    st: "published",
  },
  {
    id: 4,
    title: "Настройка нового Android с нуля",
    author: "Айна Курбанова",
    date: "30 июн",
    views: 3120,
    st: "draft",
  },
  {
    id: 5,
    title: "Наушники для спорта: что выбрать",
    author: "Мердан Аннаев",
    date: "29 июн",
    views: 5680,
    st: "published",
  },
  {
    id: 6,
    title: "Умные часы: сравнение моделей 2026",
    author: "Джерен Байрамова",
    date: "10 июл",
    views: 0,
    st: "scheduled",
  },
  {
    id: 7,
    title: "Как продлить срок службы батареи",
    author: "Батыр Гельдиев",
    date: "28 июн",
    views: 940,
    st: "draft",
  },
  {
    id: 8,
    title: "Обзор MacBook Air M3",
    author: "Гульнара Оразова",
    date: "27 июн",
    views: 15900,
    st: "published",
  },
  {
    id: 9,
    title: "Аксессуары, без которых не обойтись",
    author: "Айна Курбанова",
    date: "12 июл",
    views: 0,
    st: "scheduled",
  },
  {
    id: 10,
    title: "Гид по игровым приставкам",
    author: "Довлет Ниязов",
    date: "26 июн",
    views: 7230,
    st: "published",
  },
];
