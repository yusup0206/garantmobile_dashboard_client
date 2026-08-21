import { describe, it, expect } from "vitest";
import { matches, toRow } from "./customers.helpers";
import type { Customer } from "@/services/customers/customers.types";

const customer: Customer = {
  id: "c-1",
  name: "Айна Бердиева",
  phone: "+99365123456",
  email: "ayna@example.com",
  city: "Ашхабад",
  tier: "vip",
  bonusBalance: 9720,
  ordersCount: 14,
  isBlocked: false,
};

describe("matches", () => {
  it("matches by name, phone and city, case-insensitively", () => {
    expect(matches(customer, "айна")).toBe(true);
    expect(matches(customer, "65123456")).toBe(true);
    expect(matches(customer, "АШХАБАД")).toBe(true);
    expect(matches(customer, "мары")).toBe(false);
  });

  it("matches everything on an empty query", () => {
    expect(matches(customer, "")).toBe(true);
    expect(matches(customer, "   ")).toBe(true);
  });
});

describe("toRow", () => {
  it("derives initials and status meta", () => {
    const row = toRow(customer);
    expect(row.initials).toBe("АБ");
    expect(row.tierMeta.labelKey).toBe("status.tier.vip");
    expect(row.statusMeta.labelKey).toBe("cust.status.active");
  });
});
