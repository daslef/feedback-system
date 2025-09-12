import { Generated, Selectable, Updateable, Insertable } from "kysely";

export interface PersonContactTable {
  id: Generated<number>;
  contact_id: number;
  person_id: number;
}

export type PersonContact = Selectable<PersonContactTable>;
export type NewPersonContact = Insertable<PersonContactTable>;
export type UpdatePersonContact = Updateable<PersonContactTable>;
