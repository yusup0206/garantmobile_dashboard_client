export type Unit = {
  id: string;
  nameTk: string;
  nameRu: string;
  shortName: string;
  isDefault: boolean;
};

/** Payload for create/update unit */
export type UnitInput = Omit<Unit, "id">;

export type GetUnitsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  lang?: string;
};

export type GetUnitsResponse = {
  count: number;
  units: Unit[];
};

export type DeleteUnitResponse = {
  deleted: boolean;
};

