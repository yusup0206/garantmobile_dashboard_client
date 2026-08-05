export type ApiError = {
  status: number;
  message: string;
};

export type RequestOptions = RequestInit & {
  token?: string;
};
