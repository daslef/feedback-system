import { Generated, Selectable } from "kysely";

export interface ContactTypeTable {
  id: Generated<number>;
  title: "phone" | "email" | "social";
}

export type ContactType = Selectable<ContactTypeTable>;
