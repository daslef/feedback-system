import { db } from "@shared/database";

function formatFullName(
  lastName: string,
  firstName: string,
  middleName?: string | null,
) {
  return [lastName, firstName, middleName].filter(Boolean).join(" ");
}

export default async function _enrichSelect(
  databaseInstance: typeof db,
  feedbackData: any,
) {
  const personFullName = formatFullName(
    feedbackData.person_last_name,
    feedbackData.person_first_name,
    feedbackData.person_middle_name,
  );

  const responsiblePerson = await databaseInstance
    .selectFrom("official_responsibility")
    .innerJoin("person", "official_responsibility.official_id", "person.id")
    .select([
      "person.first_name as official_first_name",
      "person.last_name as official_last_name",
      "person.middle_name as official_middle_name",
    ])
    .where(
      "official_responsibility.administrative_unit_id",
      "=",
      feedbackData.administrative_unit_id,
    )
    .executeTakeFirst();

  const responsiblePersonFullName = responsiblePerson
    ? formatFullName(
        responsiblePerson.official_last_name,
        responsiblePerson.official_first_name,
        responsiblePerson.official_middle_name,
      )
    : null;

  return {
    ...feedbackData,
    person_full_name: personFullName,
    person_phone: feedbackData.person_phone || null,
    responsible_person_full_name: responsiblePersonFullName,
  };
}