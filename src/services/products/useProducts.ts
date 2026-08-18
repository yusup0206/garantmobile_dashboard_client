import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "./products.api";
import type { GetProductsParams, ProductInput } from "./products.types";

export const productsKeys = {
  all: ["products"] as const,
  list: (params?: GetProductsParams) =>
    ["products", "list", params] as const,
  detail: (id?: string) => ["products", "detail", id] as const,
};

export function useProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: productsKeys.list(params),
    queryFn: () => getProducts(params),
  });
}

/** Load a product's editable detail. Enabled on demand. */
export function useProductDetail(id: string | null, lang?: string) {
  return useQuery({
    queryKey: productsKeys.detail(id ?? undefined),
    queryFn: () => getProduct(id as string, lang),
    enabled: id !== null,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, lang }: { input: ProductInput; lang?: string }) =>
      createProduct(input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: productsKeys.all }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
      lang,
    }: {
      id: string;
      input: ProductInput;
      lang?: string;
    }) => updateProduct(id, input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: productsKeys.all }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) =>
      deleteProduct(id, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: productsKeys.all }),
  });
}
