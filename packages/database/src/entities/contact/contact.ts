import {
  Generated,
  Selectable,
  Updateable,
  Insertable,
} from "kysely";

export interface ContactTable {
  id: Generated<number>;
  value: string;
  contact_type_id: number;
  person_id: number;
}

export type Contact = Selectable<ContactTable>;
export type NewContact = Insertable<ContactTable>;
export type UpdateContact = Updateable<ContactTable>;
