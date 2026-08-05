import { describe, it, expect } from "vitest";
import { adminSchema } from "./admin.schema";

describe("adminSchema", () => {
  it("accepts a valid staff member", () => {
    const res = adminSchema.safeParse({
      name: "Ага Мурадов",
      email: "aga@garantmobile.tm",
      role: "manager",
      st: "active",
    });
    expect(res.success).toBe(true);
  });

  it("rejects an invalid e-mail", () => {
    expect(
      adminSchema.safeParse({
        name: "Ага Мурадов",
        email: "not-an-email",
        role: "manager",
        st: "active",
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown role", () => {
    expect(
      adminSchema.safeParse({
        name: "Ага Мурадов",
        email: "aga@garantmobile.tm",
        role: "ceo",
        st: "active",
      }).success,
    ).toBe(false);
  });
});
