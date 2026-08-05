export type UnitKind = "store" | "warehouse" | "service";

export type UnitStatus = "open" | "closed";

export type Unit = {
  id: number;
  name: string;
  city: string;
  kind: UnitKind;
  staff: number;
  st: UnitStatus;
};

/** Payload for create/update — everything except the server-assigned id. */
export type UnitInput = Omit<Unit, "id">;
