import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatusMenu } from "@/components/common/StatusMenu";
import type { StatusOption } from "@/components/common/StatusMenu";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { money } from "@/lib/format";
import { useOrderDetails } from "@/services/orders/useOrders";
import type { Order, OrderStatusKey } from "@/services/orders/orders.types";
import { ORDER_STATUS } from "@/data/mock";
import {
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Tag,
  Truck,
  User,
} from "lucide-react";

type OrderDetailDialogProps = {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: StatusOption[];
  onStatusChange: (id: string, st: OrderStatusKey) => void;
};

export function OrderDetailDialog({
  order,
  open,
  onOpenChange,
  options,
  onStatusChange,
}: OrderDetailDialogProps) {
  const t = useT();

  // Fetch full details if order has an ID
  const { data: fullOrder } = useOrderDetails(
    open && order?.id ? order.id : undefined,
  );

  const activeOrder: Order | null = fullOrder ?? order;
  if (!activeOrder) return null;

  const currentMeta = ORDER_STATUS[activeOrder.status] ?? {
    labelKey: "status.order.pending",
    fg: "#6b7280",
    bg: "#f3f4f6",
    dot: "#9ca3af",
  };

  const customerName =
    activeOrder.customer?.name || activeOrder.recipientName || "—";
  const customerPhone =
    activeOrder.customer?.phone || activeOrder.recipientPhone || "";

  const items = activeOrder.items ?? [];
  const itemsTotal = Number(activeOrder.itemsTotal) || 0;
  const deliveryCost = Number(activeOrder.deliveryCost) || 0;
  const discountTotal = Number(activeOrder.discountTotal) || 0;
  const grandTotal = Number(activeOrder.total) || 0;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-2xl">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4 pr-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-xl font-bold text-ink">
                {activeOrder.orderNumber}
              </h2>
              <StatusBadge meta={currentMeta} />
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(activeOrder.created)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusMenu
              options={options}
              value={activeOrder.status}
              onSelect={(st) =>
                onStatusChange(
                  activeOrder.id || activeOrder.orderNumber,
                  st as OrderStatusKey,
                )
              }
            />
          </div>
        </div>

        <div className="mt-4 space-y-6">
          {/* Customer & Delivery row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Customer info */}
            <div className="rounded-xl border border-line bg-canvas/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <User className="h-3.5 w-3.5" />
                <span>{t("orders.details.customer")}</span>
              </div>
              <div className="mt-2 font-display text-sm font-bold text-ink">
                {customerName}
              </div>
              {customerPhone && (
                <div className="mt-1.5 flex items-center gap-2">
                  <a
                    href={`tel:${customerPhone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-dark hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{customerPhone}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Delivery info */}
            <div className="rounded-xl border border-line bg-canvas/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <Truck className="h-3.5 w-3.5" />
                <span>{t("orders.details.delivery")}</span>
              </div>
              <div className="mt-2 text-xs font-medium text-ink">
                {activeOrder.deliveryTitleRu ||
                  activeOrder.deliveryTitleTk ||
                  t("form.delivery")}
              </div>
              {activeOrder.deliveryAddress && (
                <div className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="break-words">{activeOrder.deliveryAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment & Promo info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-canvas/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <CreditCard className="h-3.5 w-3.5" />
                <span>{t("orders.details.payment")}</span>
              </div>
              <div className="mt-2 text-xs font-medium text-ink">
                {activeOrder.paymentTitleRu ||
                  activeOrder.paymentTitleTk ||
                  t("form.payment")}
              </div>
              {activeOrder.paymentStatus && (
                <div className="mt-1 text-xs text-muted">
                  {t("orders.detail.paymentStatus")}{" "}
                  <span className="font-medium text-ink">{activeOrder.paymentStatus}</span>
                </div>
              )}
            </div>

            {activeOrder.promoCode ? (
              <div className="rounded-xl border border-line bg-canvas/40 p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  <Tag className="h-3.5 w-3.5" />
                  <span>{t("orders.details.promocode")}</span>
                </div>
                <div className="mt-2 font-mono text-xs font-bold text-brand-dark">
                  {activeOrder.promoCode}
                </div>
                {activeOrder.promoDiscountValue && (
                  <div className="mt-1 text-xs text-muted">
                    {t("orders.detail.promoDiscount")} {activeOrder.promoDiscountValue}{" "}
                    {activeOrder.promoDiscountType === "PERCENTAGE" ? "%" : "m"}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Comment */}
          {activeOrder.comment && (
            <div className="rounded-xl border border-line bg-canvas/40 p-3.5 text-xs">
              <span className="font-semibold text-muted">
                {t("orders.details.comment")}:{" "}
              </span>
              <span className="text-ink">{activeOrder.comment}</span>
            </div>
          )}

          {/* Order Items */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <Package className="h-3.5 w-3.5" />
              <span>
                {t("orders.details.items")} ({items.length})
              </span>
            </div>

            <div className="mt-2 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
              {items.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted">
                  {t("orders.detail.noItems")}
                </div>
              ) : (
                items.map((it) => {
                  const unitPrice = Number(it.unitPrice) || 0;
                  const totalPrice = Number(it.totalPrice) || unitPrice * it.quantity;
                  const optionsEntries = Object.entries(it.selectedOptions ?? {});

                  return (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-3 p-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {it.photo ? (
                          <img
                            src={it.photo}
                            alt={it.productNameRu}
                            className="h-10 w-10 rounded-lg object-cover border border-line"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas border border-line text-muted">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-ink">
                            {it.productNameRu || it.productNameTk}
                          </div>
                          {optionsEntries.length > 0 && (
                            <div className="text-[11px] text-muted">
                              {optionsEntries
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(", ")}
                            </div>
                          )}
                          <div className="text-[11px] text-muted">
                            {it.quantity} × {money(unitPrice)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-display font-bold text-ink">
                        {money(totalPrice)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="space-y-1.5 rounded-xl border border-line bg-canvas/60 p-4 text-xs">
            <div className="flex justify-between text-muted">
              <span>{t("orders.details.itemsTotal")}</span>
              <span>{money(itemsTotal || grandTotal)}</span>
            </div>
            {deliveryCost > 0 && (
              <div className="flex justify-between text-muted">
                <span>{t("orders.details.deliveryCost")}</span>
                <span>{money(deliveryCost)}</span>
              </div>
            )}
            {discountTotal > 0 && (
              <div className="flex justify-between text-brand-dark">
                <span>{t("orders.details.discount")}</span>
                <span>-{money(discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-2 font-display text-sm font-bold text-ink">
              <span>{t("orders.details.grandTotal")}</span>
              <span className="text-brand-dark">{money(grandTotal)}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-1 text-xs text-muted">
            <div className="flex justify-between">
              <span>{t("orders.detail.created")}</span>
              <span>{formatDate(activeOrder.created)}</span>
            </div>
            {activeOrder.confirmedAt && (
              <div className="flex justify-between">
                <span>{t("orders.detail.confirmed")}</span>
                <span>{formatDate(activeOrder.confirmedAt)}</span>
              </div>
            )}
            {activeOrder.cancelledAt && (
              <div className="flex justify-between text-rose-500">
                <span>{t("orders.detail.cancelled")}</span>
                <span>{formatDate(activeOrder.cancelledAt)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            {t("common.close")}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
