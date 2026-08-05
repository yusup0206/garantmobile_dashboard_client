import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHeroSlide,
  deleteHeroSlide,
  getHeroSlides,
  updateHeroSlide,
} from "./heroSlides.api";
import type { HeroSlideInput } from "./heroSlides.types";

export const heroSlidesKeys = {
  all: ["hero-slides"] as const,
  list: ["hero-slides", "list"] as const,
};

export function useHeroSlides() {
  return useQuery({ queryKey: heroSlidesKeys.list, queryFn: getHeroSlides });
}

export function useCreateHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: HeroSlideInput) => createHeroSlide(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: heroSlidesKeys.all }),
  });
}

export function useUpdateHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: HeroSlideInput }) =>
      updateHeroSlide(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: heroSlidesKeys.all }),
  });
}

export function useDeleteHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteHeroSlide(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: heroSlidesKeys.all }),
  });
}
