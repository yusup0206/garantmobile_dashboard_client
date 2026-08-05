import { Link } from "react-router-dom";
import { useT } from "@/i18n/useT";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingState } from "@/components/common/LoadingState";
import { useRecentOrders } from "@/services/orders/useOrders";
import { ORDER_STATUS } from "@/data/mock";
import { money } from "@/lib/format";

export function RecentOrders() {
  const t = useT();
  const { data, isLoading } = useRecentOrders(6);
  if (isLoading || !data)
    return (
      <Card>
        <LoadingState />
      </Card>
    );

  return (
    <Card>
      <CardHeader
        title={t("dashboard.recentOrders")}
        action={
          <Link
            to="/orders"
            className="text-sm font-semibold text-brand-dark hover:underline"
          >
            {t("dashboard.allOrders")}
          </Link>
        }
      />
      <ul className="flex flex-col divide-y divide-line">
        {data.map((o) => (
          <li key={o.num} className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <div className="font-display text-sm font-bold text-ink">{o.num}</div>
              <div className="text-xs text-muted">{o.date}</div>
            </div>
            <StatusBadge meta={ORDER_STATUS[o.st]} />
            <div className="shrink-0 font-display text-sm font-bold text-ink">
              {money(o.total)}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
