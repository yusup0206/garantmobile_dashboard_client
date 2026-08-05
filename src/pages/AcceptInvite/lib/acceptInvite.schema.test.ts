import { describe, it, expect } from "vitest";
import { acceptInviteSchema } from "./acceptInvite.schema";

describe("acceptInviteSchema", () => {
  it("accepts a strong, matching password", () => {
    const res = acceptInviteSchema.safeParse({
      password: "Secret123",
      confirm: "Secret123",
    });
    expect(res.success).toBe(true);
  });

  it("rejects a short password", () => {
    const res = acceptInviteSchema.safeParse({
      password: "Ab1",
      confirm: "Ab1",
    });
    expect(res.success).toBe(false);
  });

  it("rejects a password without a digit", () => {
    const res = acceptInviteSchema.safeParse({
      password: "OnlyLetters",
      confirm: "OnlyLetters",
    });
    expect(res.success).toBe(false);
  });

  it("rejects a mismatched confirmation", () => {
    const res = acceptInviteSchema.safeParse({
      password: "Secret123",
      confirm: "Secret124",
    });
    expect(res.success).toBe(false);
  });
});
