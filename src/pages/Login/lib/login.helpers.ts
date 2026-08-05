const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Generate a 5-char demo captcha (no ambiguous glyphs). */
export function genCaptcha(): string {
  let s = "";
  for (let i = 0; i < 5; i++) {
    s += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return s;
}

export function captchaMatches(input: string, expected: string): boolean {
  return input.trim().toUpperCase() === expected;
}
