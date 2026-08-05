import { useQuery } from "@tanstack/react-query";
import { getPayments } from "./payments.api";

export const paymentsKeys = {
  all: ["payments"] as const,
};

export function usePayments() {
  return useQuery({ queryKey: paymentsKeys.all, queryFn: getPayments });
}
