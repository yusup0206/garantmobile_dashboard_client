export type ReviewStatusKey = "published" | "pending" | "rejected";

export type ReviewRating = 1 | 2 | 3 | 4 | 5 | number;

export type ReviewProduct = {
  id: string;
  nameRu: string;
  nameTk: string;
};

export type ReviewCustomer = {
  id: string;
  name: string;
  phone: string;
};

export type Review = {
  id: string;
  productId: string;
  product?: ReviewProduct | null;
  customerId: string;
  customer?: ReviewCustomer | null;
  text: string;
  rating: ReviewRating;
  status: ReviewStatusKey;
  created: string;
  updated: string;
};

export type GetReviewsParams = {
  page?: number;
  pageSize?: number;
  productId?: string;
  status?: ReviewStatusKey;
  customerId?: string;
};

export type GetReviewsResponse = {
  count: number;
  reviews: Review[];
};

