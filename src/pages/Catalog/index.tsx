import { useMemo } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs, type FilterTab } from "@/components/common/FilterTabs";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { useCatalog, useCategories } from "@/services/catalog/useCatalog";

import { CatalogTable } from "./ui/CatalogTable";
import { toRow } from "./lib/catalog.helpers";

export default function CatalogPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useCatalog();
  const { data: categories = [] } = useCategories();

  // URL state: /catalog?cat=phones — shareable & survives refresh.
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") ?? "all";

  const rows = useMemo(() => {
    const all = (data ?? []).map(toRow);
    return cat === "all" ? all : all.filter((r) => r.cat === cat);
  }, [data, cat]);

  const tabs = useMemo<FilterTab[]>(
    () => [{ key: "all", label: "filter.all" }, ...categories],
    [categories],
  );

  function setCat(key: string) {
    setParams(key === "all" ? {} : { cat: key }, { replace: true });
  }

  return (
    <div>
      <PageHeader
        title={t("page.catalog.title")}
        subtitle={t("page.catalog.subtitle")}
        action={<FilterTabs tabs={tabs} value={cat} onChange={setCat} />}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("catalog.empty")} />
      ) : (
        <CatalogTable rows={rows} />
      )}
    </div>
  );
}
