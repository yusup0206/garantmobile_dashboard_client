import { z } from "zod";

export const driverSchema = z.object({
  name: z.string().min(2, "err.personNameMin2"),
  phone: z.string().min(6, "drivers.err.phone"),
  zone: z.string().min(2, "drivers.err.zone"),
  st: z.enum(["online", "busy", "offline"]),
});

export type DriverFormValues = z.infer<typeof driverSchema>;
