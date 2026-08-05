import { describe, it, expect } from "vitest";
import { fmtDelta, REASON_LABEL } from "./inventory.helpers";

describe("fmtDelta", () => {
  it("prefixes a positive delta with +", () => {
    expect(fmtDelta(5)).toBe("+5");
  });
  it("renders a negative delta with a minus sign", () => {
    expect(fmtDelta(-3)).toBe("−3");
  });
});

describe("REASON_LABEL", () => {
  it("maps every reason to a dotted key", () => {
    expect(REASON_LABEL.order_reserve).toBe("inv.reason.order_reserve");
    expect(REASON_LABEL.restock).toBe("inv.reason.restock");
  });
});
