import { describe, it, expect } from "vitest";
import { userSchema } from "./user.schema";

describe("userSchema", () => {
  it("accepts a valid staff member", () => {
    const res = userSchema.safeParse({
      name: "Ага Мурадов",
      email: "aga@garantmobile.tm",
      role: "manager",
      st: "active",
    });
    expect(res.success).toBe(true);
  });

  it("rejects an invalid e-mail", () => {
    expect(
      userSchema.safeParse({
        name: "Ага Мурадов",
        email: "not-an-email",
        role: "manager",
        st: "active",
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown role", () => {
    expect(
      userSchema.safeParse({
        name: "Ага Мурадов",
        email: "aga@garantmobile.tm",
        role: "ceo",
        st: "active",
      }).success,
    ).toBe(false);
  });
});
