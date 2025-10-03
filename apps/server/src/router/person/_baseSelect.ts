import { db } from "@shared/database";

export default function _baseSelect(databaseInstance: typeof db) {
  return databaseInstance
    .selectFrom("person")
    .innerJoin("person_type", "person.person_type_id", "person_type.id")
    .innerJoin("person_contact", "person.contact_id", "person_contact.id")
    .select([
      "person.id",
      "person.first_name",
      "person.last_name",
      "person.middle_name",
      "person.person_type_id",
      "person.contact_id",
      "person_type.title as person_type",
      "person_contact.phone as phone",
      "person_contact.email as email",
      "person_contact.social as social",
    ]);
}
