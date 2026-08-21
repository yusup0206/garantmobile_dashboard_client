import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LANG, I18N, type Lang } from "@/i18n/dict";

type LangState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

/** Current UI language, persisted so a refresh keeps the choice. */
export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: DEFAULT_LANG,
      setLang: (lang) => set({ lang: I18N[lang] ? lang : DEFAULT_LANG }),
    }),
    {
      name: "gm.lang",
      merge: (persistedState, currentState) => {
        const state = persistedState as Partial<LangState>;
        const lang = state?.lang && I18N[state.lang] ? state.lang : DEFAULT_LANG;
        return { ...currentState, ...state, lang };
      },
    },
  ),
);
