import { describe, it, expect } from "vitest";
import { changePasswordSchema } from "./changePassword.schema";

const base = {
  currentPassword: "garant2026",
  newPassword: "Secret123",
  confirm: "Secret123",
};

describe("changePasswordSchema", () => {
  it("accepts a strong, matching, changed password", () => {
    expect(changePasswordSchema.safeParse(base).success).toBe(true);
  });

  it("requires the current password", () => {
    const res = changePasswordSchema.safeParse({ ...base, currentPassword: "" });
    expect(res.success).toBe(false);
  });

  it("rejects a weak new password", () => {
    const res = changePasswordSchema.safeParse({
      ...base,
      newPassword: "abcdefgh",
      confirm: "abcdefgh",
    });
    expect(res.success).toBe(false);
  });

  it("rejects a mismatched confirmation", () => {
    const res = changePasswordSchema.safeParse({ ...base, confirm: "Secret124" });
    expect(res.success).toBe(false);
  });

  it("rejects a new password equal to the current one", () => {
    const res = changePasswordSchema.safeParse({
      currentPassword: "Secret123",
      newPassword: "Secret123",
      confirm: "Secret123",
    });
    expect(res.success).toBe(false);
  });
});
