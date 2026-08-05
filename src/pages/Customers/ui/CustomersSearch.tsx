import { Search } from "lucide-react";
import { useT } from "@/i18n/useT";
import { Input } from "@/components/ui/Input";

type CustomersSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CustomersSearch({ value, onChange }: CustomersSearchProps) {
  const t = useT();
  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("customers.searchPlaceholder")}
        aria-label={t("customers.search")}
        className="h-11 pl-10"
      />
    </div>
  );
}
