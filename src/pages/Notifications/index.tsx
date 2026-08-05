import { useMemo } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";
import { CheckCheck } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs } from "@/components/common/FilterTabs";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/services/notifications/useNotifications";

import { NotificationItem } from "./ui/NotificationItem";
import { FILTER_TABS } from "./lib/notifications.helpers";

export default function NotificationsPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  // URL state: /notifications?type=order — shareable & survives refresh.
  const [params, setParams] = useSearchParams();
  const filter = params.get("type") ?? "all";

  const items = useMemo(() => {
    const all = data ?? [];
    return filter === "all" ? all : all.filter((n) => n.kind === filter);
  }, [data, filter]);

  const unread = useMemo(() => (data ?? []).filter((n) => !n.read).length, [data]);

  function setFilter(key: string) {
    setParams(key === "all" ? {} : { type: key }, { replace: true });
  }

  const subtitle =
    unread > 0 ? `${unread} ${t("notifications.unread")}` : t("page.notifications.subtitle");

  return (
    <div>
      <PageHeader
        title={t("page.notifications.title")}
        subtitle={subtitle}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllRead.mutate()}
              disabled={unread === 0 || markAllRead.isPending}
            >
              <CheckCheck className="h-4 w-4" />
              {t("notifications.markAll")}
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState title={t("notifications.empty")} />
      ) : (
        <Card className="p-0">
          <div className="divide-y divide-line">
            {items.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onMarkRead={(id) => markRead.mutate(id)}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
