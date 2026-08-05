import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LANG, type Lang } from "@/i18n/dict";

type LangState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

/** Current UI language, persisted so a refresh keeps the choice. */
export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: DEFAULT_LANG,
      setLang: (lang) => set({ lang }),
    }),
    { name: "gm.lang" },
  ),
);
