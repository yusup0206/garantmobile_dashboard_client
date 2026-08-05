import { Globe, Check } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { useLangStore } from "@/store/i18n.store";
import { I18N, LANG_LABELS, type Lang } from "@/i18n/dict";
import { useT } from "@/i18n/useT";

const CODES = Object.keys(I18N) as Lang[];

/** Language picker for the topbar. Reads/writes the persisted language store. */
export function LanguageSwitcher() {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const t = useT();

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button
          type="button"
          aria-label={t("topbar.language")}
          className="flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-muted transition-colors hover:bg-canvas hover:text-ink"
        >
          <Globe className="h-5 w-5" strokeWidth={1.9} />
          <span className="text-sm font-semibold uppercase">{lang}</span>
        </button>
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        {CODES.map((code) => (
          <Dropdown.Item key={code} onSelect={() => setLang(code)}>
            <span className="flex-1">{LANG_LABELS[code]}</span>
            {code === lang ? <Check className="h-4 w-4 text-brand" /> : null}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
