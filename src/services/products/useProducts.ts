import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "./products.api";
import type { ProductInput } from "./products.types";

export const productsKeys = {
  all: ["products"] as const,
  detail: (id: number) => ["products", id] as const,
};

export function useProducts() {
  return useQuery({ queryKey: productsKeys.all, queryFn: getProducts });
}

/** Load a product's editable detail (with variants). Enabled on demand. */
export function useProductDetail(id: number | null) {
  return useQuery({
    queryKey: id !== null ? productsKeys.detail(id) : ["products", "none"],
    queryFn: () => getProduct(id as number),
    enabled: id !== null,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) => createProduct(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: productsKeys.all }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ProductInput }) =>
      updateProduct(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: productsKeys.all }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productsKeys.all }),
  });
}
