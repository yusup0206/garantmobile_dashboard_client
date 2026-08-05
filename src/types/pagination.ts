export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type PageParams = {
  page?: number;
  pageSize?: number;
};
