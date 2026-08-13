import type { Unit } from "@/services/units/units.types";

export type UnitView = Unit & {
  displayName: string;
};

export function toView(unit: Unit, lang: string = "tk"): UnitView {
  return {
    ...unit,
    displayName: lang === "ru" ? unit.nameRu || unit.nameTk : unit.nameTk || unit.nameRu,
  };
}
