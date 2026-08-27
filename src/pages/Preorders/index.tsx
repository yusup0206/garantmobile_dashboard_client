import { useMemo } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs, type FilterTab } from "@/components/common/FilterTabs";

import { PreorderTagsTab } from "./ui/PreorderTagsTab";
import { PreordersTab } from "./ui/PreordersTab";
import { PreorderRequestsTab } from "./ui/PreorderRequestsTab";

export type PreordersMainTab = "tags" | "preorders" | "requests";

export default function PreordersPage() {
  const t = useT();
  const [params, setParams] = useSearchParams();
  const activeTab = (params.get("tab") as PreordersMainTab) || "tags";

  const mainTabs: FilterTab[] = useMemo(
    () => [
      { key: "tags", label: "preorders.tabs.tags" },
      { key: "preorders", label: "preorders.tabs.preorders" },
      { key: "requests", label: "preorders.tabs.requests" },
    ],
    [],
  );

  function handleTabChange(key: string) {
    const next = new URLSearchParams();
    if (key !== "tags") {
      next.set("tab", key);
    }
    setParams(next, { replace: true });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.preorders.title")}
        subtitle={t("page.preorders.subtitle")}
        action={
          <FilterTabs
            tabs={mainTabs}
            value={activeTab}
            onChange={handleTabChange}
          />
        }
      />

      {/* Render active sub-tab */}
      {activeTab === "tags" && <PreorderTagsTab />}
      {activeTab === "preorders" && <PreordersTab />}
      {activeTab === "requests" && <PreorderRequestsTab />}
    </div>
  );
}
