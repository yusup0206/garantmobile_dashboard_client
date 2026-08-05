export type DriverStatusKey = "online" | "busy" | "offline";

export type Driver = {
  id: number;
  name: string;
  phone: string;
  zone: string;
  deliveries: number;
  st: DriverStatusKey;
};

/** Payload for create/update — id is server-assigned and deliveries is a running count. */
export type DriverInput = Omit<Driver, "id" | "deliveries">;
