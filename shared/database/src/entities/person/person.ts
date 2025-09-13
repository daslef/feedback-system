import { Generated, Selectable, Insertable, Updateable } from "kysely";

export interface PersonTable {
  id: Generated<number>;
  first_name: string;
  last_name: string;
  middle_name: string;
  person_type_id: number;
}

export type Person = Selectable<PersonTable>;
export type NewPerson = Insertable<PersonTable>;
export type UpdatePerson = Updateable<PersonTable>;
