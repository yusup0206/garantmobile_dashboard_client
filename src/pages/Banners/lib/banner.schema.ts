import { z } from "zod";

export const bannerSchema = z.object({
  titleRu: z.string(),
  titleTk: z.string(),
  subtitleRu: z.string(),
  subtitleTk: z.string(),
  imageRu: z.string(),
  imageTk: z.string(),
  price: z.number().min(0),
  oldPrice: z.number().min(0),
  sortOrder: z.number().int().min(0),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  isActive: z.boolean(),
  placement: z.enum([
    "main_slider",
    "side_top",
    "side_bottom",
    "grid_left",
    "grid_right",
    "trade_in",
  ]),
  linkType: z.enum(["product", "category", "tradein", "external_link", "offers"]),
  linkId: z.string().nullable(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
