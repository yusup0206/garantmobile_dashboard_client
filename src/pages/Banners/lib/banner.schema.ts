import { z } from "zod";

const loc = z.object({ ru: z.string(), tm: z.string() });

export const bannerSchema = z.object({
  placement: z.enum(["home", "category", "checkout"]),
  order: z.number().int().min(0),
  img: z.string().min(1, "err.imgRequired"),
  kicker: loc,
  title: loc,
  ctaLabel: loc,
  to: z.string(),
  overlay: z.enum(["brand", "dark"]),
  startsAt: z.string().nullable(),
  endsAt: z.string().nullable(),
  st: z.enum(["active", "paused", "draft"]),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
