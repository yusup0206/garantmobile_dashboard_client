import { z } from "zod";

export const deliveryTypeSchema = z.object({
  titleRu: z.string().min(2, "err.titleMin2"),
  titleTk: z.string().min(2, "err.titleMin2"),
  descriptionRu: z.string().optional().default(""),
  descriptionTk: z.string().optional().default(""),
  icon: z.string().optional().default(""),
  price: z.coerce.number().min(0).default(0),
  freeFrom: z.string().optional().default(""),
  deliveryTime: z.string().optional().default(""),
  discountForMethod: z.coerce.number().min(0).default(0),
  isSelfPickup: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type DeliveryTypeFormValues = z.infer<typeof deliveryTypeSchema>;
