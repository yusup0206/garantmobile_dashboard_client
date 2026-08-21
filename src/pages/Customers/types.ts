import type { CustomerFilterType, CustomerTier } from "@/services/customers/customers.types";

export type CustomerFilter = "all" | CustomerFilterType;
export type { CustomerTier, CustomerFilterType };
