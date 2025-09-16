import type { Kysely } from "kysely";
import type { Database } from "../interface";

import projectsData from "./data/projects_deserialized.json" with { type: "json" };
import topicsAndCategoriesData from "./data/topics_and_categories.json" with {
  type: "json",
};
import towns from "./data/towns";

type ProjectsDataItem = {
  title: string;
  coordinates: string;
  year: number;
  link: string;
  status: string;
  segment_title: string;
  segment_img: string;
  region: string;
  img: string;
};

type TopicsAndCategoriesDataItem = {
  title: string;
  items: string[];
};

export async function seedAdministrativeUnitTypes(db: Kysely<Database>) {
  await db
    .insertInto("administrative_unit_type")
    .values([{ title: "settlement" }, { title: "town" }])
    .execute();
}

export async function seedAdministrativeUnits(db: Kysely<Database>) {
  const { id: unitTypeTownId } = await db
    .selectFrom("administrative_unit_type")
    .select(["id"])
    .where("title", "=", "town")
    .executeTakeFirstOrThrow();

  const { id: unitTypeSettlementId } = await db
    .selectFrom("administrative_unit_type")
    .select(["id"])
    .where("title", "=", "settlement")
    .executeTakeFirstOrThrow();

  const regions: Set<string> = new Set();
  Object.values(projectsData).forEach(({ region }) => {
    if (!(region in regions)) {
      regions.add(region);
    }
  });

  await db
    .insertInto("administrative_unit")
    .values(
      [...regions].map((title) => ({
        title,
        unit_type_id: towns.has(title) ? unitTypeTownId : unitTypeSettlementId,
      })),
    )
    .execute();
}

export async function seedFeedbackStatuses(db: Kysely<Database>) {
  await db
    .insertInto("feedback_status")
    .values([
      { title: "approved" },
      { title: "declined" },
      { title: "pending" },
    ])
    .execute();
}

export async function seedFeedbackTypes(db: Kysely<Database>) {
  await db
    .insertInto("feedback_type")
    .values([{ title: "Пожелание" }, { title: "Замечание" }])
    .execute();
}

export async function seedFeedbackTopics(db: Kysely<Database>) {
  const feedbackTopics: Set<string> = new Set(
    (topicsAndCategoriesData as TopicsAndCategoriesDataItem[])
      .map(({ items }) => items)
      .reduce((acc, itemsArray) => [...acc, ...itemsArray], []),
  );

  await db
    .insertInto("feedback_topic")
    .values([...feedbackTopics].map((topic) => ({ title: topic })))
    .execute();
}

export async function seedFeedbackTopicCategories(db: Kysely<Database>) {
  const feedbackTopicCategories = (
    topicsAndCategoriesData as TopicsAndCategoriesDataItem[]
  ).map(({ title }) => ({ title }));

  await db
    .insertInto("feedback_topic_category")
    .values(feedbackTopicCategories)
    .execute();
}

export async function seedFeedbackTopicCategoryTopic(db: Kysely<Database>) {
  for (const { title, items } of topicsAndCategoriesData) {
    const { id: feedbackTopicCategoryId } = await db
      .selectFrom("feedback_topic_category")
      .select("id")
      .where("title", "=", title)
      .executeTakeFirstOrThrow();

    for (const topic of items) {
      const { id: feedbackTopicId } = await db
        .selectFrom("feedback_topic")
        .select("id")
        .where("title", "=", topic)
        .executeTakeFirstOrThrow();

      await db
        .insertInto("feedback_topic_category_topic")
        .values({
          feedback_topic_id: feedbackTopicId,
          feedback_topic_category_id: feedbackTopicCategoryId,
        })
        .execute();
    }
  }
}

export async function seedPersonTypes(db: Kysely<Database>) {
  await db
    .insertInto("person_type")
    .values([
      { title: "citizen" },
      { title: "official" },
      { title: "moderator" },
    ])
    .execute();
}

export async function seedProjects(db: Kysely<Database>) {
  const records = await Promise.all(
    Object.values(projectsData).map(
      async ({ title, coordinates, year, region }: ProjectsDataItem) => {
        const [latitude, longitude] = coordinates.split(", ").map(Number);
        const { id: administrative_unit_id } = await db
          .selectFrom("administrative_unit")
          .select(["id"])
          .where("title", "=", region)
          .executeTakeFirstOrThrow();

        return {
          title,
          latitude: (latitude && Number.isFinite(latitude)) ? latitude : 0,
          longitude: (longitude && Number.isFinite(longitude)) ? longitude : 0,
          year_of_completion: year,
          administrative_unit_id,
        };
      },
    ),
  );

  await db.insertInto("project").values(records).execute();
}
