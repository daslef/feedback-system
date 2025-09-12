import type { Generated, Insertable, Updateable, Selectable } from "kysely";

export interface AdministrativeUnitTable {
  id: Generated<number>;
  title: string;
  unit_type_id: number;
}

export type AdministrativeUnit = Selectable<AdministrativeUnitTable>;
export type NewAdministrativeUnit = Insertable<AdministrativeUnitTable>;
export type UpdateAdministrativeUnit = Updateable<AdministrativeUnitTable>;
