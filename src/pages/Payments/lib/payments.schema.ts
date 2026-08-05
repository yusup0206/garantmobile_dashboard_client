import { z } from "zod";

export const paymentTypeSchema = z.object({
  titleRu: z.string().min(1, "validation.required"),
  titleTk: z.string().min(1, "validation.required"),
  descriptionRu: z.string().default(""),
  descriptionTk: z.string().default(""),
  icon: z.string().optional().default(""),
  paymentProcent: z.coerce.number().min(0).default(0),
  paymentBonus: z.coerce.number().min(0).default(0),
  isOverpayment: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().min(0).default(0),
});

export type PaymentTypeFormValues = z.infer<typeof paymentTypeSchema>;
