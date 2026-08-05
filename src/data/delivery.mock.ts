/**
 * Mock data layer for the delivery feature — mirrors the orders mock shape.
 * In production, services/delivery/* would return this from a backend.
 */
import type { DeliveryStatusKey, Shipment } from "@/services/delivery/delivery.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const DELIVERY_STATUS: Record<DeliveryStatusKey, StatusMeta> = {
  pending: { labelKey: "status.delivery.pending", fg: "#a86a1f", bg: "#fbf1e2", dot: "#e0a144" },
  transit: { labelKey: "status.delivery.transit", fg: "#1f5f8b", bg: "#e6f1f8", dot: "#3b91d6" },
  delivered: { labelKey: "status.delivery.delivered", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  failed: { labelKey: "status.delivery.failed", fg: "#b4453a", bg: "#fbecea", dot: "#e05a4a" },
};

export const SHIPMENTS: Shipment[] = [
  {
    id: "DLV-5021",
    order: "№ GM-204817",
    city: "Ашхабад",
    courier: "Мерет Гулиев",
    date: "4 июл",
    st: "pending",
  },
  {
    id: "DLV-5020",
    order: "№ GM-204816",
    city: "Дашогуз",
    courier: "Сердар Аннаев",
    date: "4 июл",
    st: "transit",
  },
  {
    id: "DLV-5019",
    order: "№ GM-204815",
    city: "Мары",
    courier: "Байрам Оразов",
    date: "3 июл",
    st: "delivered",
  },
  {
    id: "DLV-5018",
    order: "№ GM-204814",
    city: "Туркменабат",
    courier: "Мерет Гулиев",
    date: "3 июл",
    st: "transit",
  },
  {
    id: "DLV-5017",
    order: "№ GM-204813",
    city: "Балканабат",
    courier: "Довлет Ниязов",
    date: "3 июл",
    st: "failed",
  },
  {
    id: "DLV-5016",
    order: "№ GM-204812",
    city: "Ашхабад",
    courier: "Сердар Аннаев",
    date: "2 июл",
    st: "delivered",
  },
  {
    id: "DLV-5015",
    order: "№ GM-204811",
    city: "Мары",
    courier: "Байрам Оразов",
    date: "2 июл",
    st: "pending",
  },
  {
    id: "DLV-5014",
    order: "№ GM-204810",
    city: "Дашогуз",
    courier: "Довлет Ниязов",
    date: "1 июл",
    st: "delivered",
  },
  {
    id: "DLV-5013",
    order: "№ GM-204809",
    city: "Ашхабад",
    courier: "Мерет Гулиев",
    date: "1 июл",
    st: "transit",
  },
  {
    id: "DLV-5012",
    order: "№ GM-204808",
    city: "Туркменабат",
    courier: "Сердар Аннаев",
    date: "30 июн",
    st: "failed",
  },
  {
    id: "DLV-5011",
    order: "№ GM-204807",
    city: "Балканабат",
    courier: "Байрам Оразов",
    date: "30 июн",
    st: "delivered",
  },
  {
    id: "DLV-5010",
    order: "№ GM-204806",
    city: "Мары",
    courier: "Довлет Ниязов",
    date: "29 июн",
    st: "delivered",
  },
];
