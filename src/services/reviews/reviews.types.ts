export type ReviewStatusKey = "published" | "pending" | "rejected";

export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export type Review = {
  id: number;
  product: string;
  author: string;
  rating: ReviewRating;
  text: string;
  date: string;
  st: ReviewStatusKey;
};
