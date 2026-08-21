import { describe, it, expect } from "vitest";
import { loginSchema } from "./login.schema";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const res = loginSchema.safeParse({
      phone: "+99365990099",
      password: "garant2026",
      captcha: "AB3K9",
    });
    expect(res.success).toBe(true);
  });

  it("rejects a short phone number", () => {
    const res = loginSchema.safeParse({
      phone: "123",
      password: "garant2026",
      captcha: "AB3K9",
    });
    expect(res.success).toBe(false);
  });

  it("rejects a short password", () => {
    const res = loginSchema.safeParse({
      phone: "+99365990099",
      password: "12",
      captcha: "AB3K9",
    });
    expect(res.success).toBe(false);
  });

  it("requires a captcha value", () => {
    const res = loginSchema.safeParse({
      phone: "+99365990099",
      password: "garant2026",
      captcha: "",
    });
    expect(res.success).toBe(false);
  });
});
