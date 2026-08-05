export type BrandStatus = "active" | "inactive";

export type Brand = {
  id: number;
  name: string;
  country: string;
  products: number;
  st: BrandStatus;
};

/** Payload for create/update — everything except id and the derived products count. */
export type BrandInput = Omit<Brand, "id" | "products">;
