export type CategoryStatus = "active" | "hidden";

export type Category = {
  id: number;
  name: string;
  slug: string;
  products: number;
  st: CategoryStatus;
};

/** Payload for create/update — products is a derived count, not user-set. */
export type CategoryInput = Omit<Category, "id" | "products">;
