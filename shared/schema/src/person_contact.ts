import { Generated, Selectable, Updateable, Insertable } from "kysely";

export interface PersonContactTable {
  id: Generated<number>;
  email: string;
  phone: string;
  social: string;
}

export type PersonContact = Selectable<PersonContactTable>;
export type NewPersonContact = Insertable<PersonContactTable>;
export type UpdatePersonContact = Updateable<PersonContactTable>;
