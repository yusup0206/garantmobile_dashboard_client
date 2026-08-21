export type BannerPlacement =
  | "main_slider"
  | "side_top"
  | "side_bottom"
  | "grid_left"
  | "grid_right"
  | "trade_in";

export type BannerLinkType =
  | "product"
  | "category"
  | "tradein"
  | "external_link"
  | "offers";

export type Banner = {
  id: string;
  titleRu: string;
  titleTk: string;
  subtitleRu: string;
  subtitleTk: string;
  imageRu: string;
  imageTk: string;
  price: number;
  oldPrice: number;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  placement: BannerPlacement;
  linkType: BannerLinkType;
  linkId: string | null;
};

/** Payload for create / update — everything except id. */
export type BannerInput = {
  titleRu: string;
  titleTk: string;
  subtitleRu: string;
  subtitleTk: string;
  imageRu: string;
  imageTk: string;
  price: number;
  oldPrice: number;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  placement: BannerPlacement;
  linkType: BannerLinkType;
  linkId: string | null;
};

export type GetBannersParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  linkType?: BannerLinkType;
  placement?: BannerPlacement;
};

export type GetBannersResponse = {
  count: number;
  banners: Banner[];
};
