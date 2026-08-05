import type { Unit, UnitKind, UnitStatus } from "@/services/units/units.types";
import type { StatusMeta } from "@/components/common/StatusBadge";
import type { TKey } from "@/i18n/dict";

export const UNIT_STATUS: Record<UnitStatus, StatusMeta> = {
  open: { labelKey: "status.unit.open", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  closed: { labelKey: "status.unit.closed", fg: "#6d7c74", bg: "#eef2f0", dot: "#9aa8a1" },
};

export const TYPE_LABEL: Record<UnitKind, TKey> = {
  store: "Магазин",
  warehouse: "Склад",
  service: "Сервисный центр",
};

export type UnitView = Unit & {
  typeLabel: TKey;
  meta: StatusMeta;
};

export function toView(unit: Unit): UnitView {
  return {
    ...unit,
    typeLabel: TYPE_LABEL[unit.kind],
    meta: UNIT_STATUS[unit.st],
  };
}
