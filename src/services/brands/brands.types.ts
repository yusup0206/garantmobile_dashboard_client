export type BrandTag = {
  id: string;
  nameTk: string;
  nameRu: string;
  brandId: string;
};

export type Brand = {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  homepageShow: boolean;
  sortOrder: number;
  tags?: BrandTag[];
};

export type BrandInput = {
  name: string;
  logo?: string;
  description?: string;
  homepageShow: boolean;
  sortOrder: number;
};

export type GetBrandsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type GetBrandsResponse = {
  count: number;
  brands: Brand[];
};
