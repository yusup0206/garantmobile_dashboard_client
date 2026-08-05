import { useState } from "react";
import { Plus } from "lucide-react";
import { useT } from "@/i18n/useT";

import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/Button";
import { useMovements } from "@/services/inventory/useInventory";
import { useHasPermission } from "@/lib/permissions";

import { MovementsTable } from "./ui/MovementsTable";
import { AdjustStockDialog } from "./ui/AdjustStockDialog";

export default function InventoryPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useMovements();
  const rows = data ?? [];
  const [adjustOpen, setAdjustOpen] = useState(false);
  const canAdjust = useHasPermission()("inventory:write");

  return (
    <div>
      <PageHeader
        title={t("page.inventory.title")}
        subtitle={t("page.inventory.subtitle")}
        action={
          canAdjust ? (
            <Button size="sm" onClick={() => setAdjustOpen(true)}>
              <Plus className="h-4 w-4" />
              {t("inv.adjust")}
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("inv.empty")} hint={t("inv.emptyHint")} />
      ) : (
        <MovementsTable rows={rows} />
      )}

      <AdjustStockDialog open={adjustOpen} onOpenChange={setAdjustOpen} />
    </div>
  );
}
