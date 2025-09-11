import { Generated, Selectable, Updateable, Insertable } from "kysely";

export interface OfficialResponsibilityTable {
  id: Generated<number>;
  administrative_unit_id: number;
  official_id: number;
}

export type OfficialResponsibility = Selectable<OfficialResponsibilityTable>;
export type NewOfficialResponsibility = Insertable<OfficialResponsibilityTable>;
export type UpdateOfficialResponsibility =
  Updateable<OfficialResponsibilityTable>;
