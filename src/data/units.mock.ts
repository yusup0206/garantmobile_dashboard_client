/**
 * Mock unit data. In production a feature API would return this shape from the
 * backend; the page code never changes.
 */
import type { Unit } from "@/services/units/units.types";

export const UNITS: Unit[] = [
  {
    id: "clg1x0z5e0000v6l3f4b7j2k1",
    nameTk: "Sany",
    nameRu: "Штука",
    shortName: "шт",
    isDefault: true,
  },
  {
    id: "clg1x0z5e0000v6l3f4b7j2k2",
    nameTk: "Kilogramm",
    nameRu: "Килограмм",
    shortName: "кг",
    isDefault: false,
  },
  {
    id: "clg1x0z5e0000v6l3f4b7j2k3",
    nameTk: "Metr",
    nameRu: "Метр",
    shortName: "м",
    isDefault: false,
  },
  {
    id: "clg1x0z5e0000v6l3f4b7j2k4",
    nameTk: "Litr",
    nameRu: "Литр",
    shortName: "л",
    isDefault: false,
  },
  {
    id: "clg1x0z5e0000v6l3f4b7j2k5",
    nameTk: "Guty",
    nameRu: "Коробка",
    shortName: "кор",
    isDefault: false,
  },
  {
    id: "clg1x0z5e0000v6l3f4b7j2k6",
    nameTk: "Toplum",
    nameRu: "Комплект",
    shortName: "компл",
    isDefault: false,
  },
];

