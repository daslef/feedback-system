import { Generated, Selectable, Insertable } from "kysely";

export interface AdministrativeUnitTypeTable {
  id: Generated<number>;
  title: "settlement" | "town";
}

export type AdministrativeUnitType = Selectable<AdministrativeUnitTypeTable>;
export type NewAdministrativeUnitType = Insertable<AdministrativeUnitTypeTable>;
