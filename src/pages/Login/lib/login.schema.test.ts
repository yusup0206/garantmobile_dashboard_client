import { describe, it, expect } from "vitest";
import { loginSchema } from "./login.schema";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const res = loginSchema.safeParse({
      login: "admin",
      password: "garant2026",
      captcha: "AB3K9",
    });
    expect(res.success).toBe(true);
  });

  it("rejects a short login", () => {
    const res = loginSchema.safeParse({ login: "ad", password: "1234", captcha: "X" });
    expect(res.success).toBe(false);
  });

  it("rejects a short password", () => {
    const res = loginSchema.safeParse({ login: "admin", password: "12", captcha: "X" });
    expect(res.success).toBe(false);
  });

  it("requires a captcha value", () => {
    const res = loginSchema.safeParse({ login: "admin", password: "1234", captcha: "" });
    expect(res.success).toBe(false);
  });
});
