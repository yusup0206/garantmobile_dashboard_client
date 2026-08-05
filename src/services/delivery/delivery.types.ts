export type DeliveryStatusKey = "pending" | "transit" | "delivered" | "failed";

export type Shipment = {
  id: string;
  order: string;
  city: string;
  courier: string;
  date: string;
  st: DeliveryStatusKey;
};
