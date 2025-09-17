import { Generated, Selectable } from "kysely";

export interface PersonTypeTable {
  id: Generated<number>;
  title: "citizen" | "official" | "moderator";
}

export type PersonType = Selectable<PersonTypeTable>;
