/** Shared primitive types used across features. */

export type ID = number | string;

export type Money = number; // Turkmen manat

export type AsyncStatus = "idle" | "loading" | "error" | "success";

export type Option<T = string> = {
  label: string;
  value: T;
};
