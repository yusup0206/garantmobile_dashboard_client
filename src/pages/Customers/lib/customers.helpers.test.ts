import { describe, it, expect } from "vitest";
import { matches, toRow } from "./customers.helpers";
import type { Customer } from "@/services/customers/customers.types";

const customer: Customer = {
  id: 1,
  name: "Айна Бердиева",
  city: "Ашхабад",
  orders: 14,
  spent: 486000,
  tier: "vip",
  bonusBalance: 9720,
};

describe("matches", () => {
  it("matches by name and city, case-insensitively", () => {
    expect(matches(customer, "айна")).toBe(true);
    expect(matches(customer, "АШХАБАД")).toBe(true);
    expect(matches(customer, "мары")).toBe(false);
  });

  it("matches everything on an empty query", () => {
    expect(matches(customer, "")).toBe(true);
    expect(matches(customer, "   ")).toBe(true);
  });
});

describe("toRow", () => {
  it("derives initials and formatted spend", () => {
    const row = toRow(customer);
    expect(row.initials).toBe("АБ");
    expect(row.spentFmt.replace(/\u00A0/g, " ")).toBe("486 000 m");
  });
});
