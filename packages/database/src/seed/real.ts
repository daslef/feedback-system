import type { Kysely } from "kysely";
import type { Database } from "../interface";
import projectsData from "./data/projects.json" with { type: "json" };

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

export async function seedFeedbackStatuses(db: Kysely<Database>) {
  await db
    .insertInto("feedback_status")
    .values([
      { status: "approved" },
      { status: "declined" },
      { status: "pending" },
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
          latitude: Number.isFinite(latitude) ? latitude : 0,
          longitude: Number.isFinite(longitude) ? longitude : 0,
          year_of_completion: year,
          administrative_unit_id,
        };
      },
    ),
  );

  await db.insertInto("project").values(records).execute();
}

export async function seedAdministrativeUnits(db: Kysely<Database>) {
  const regions: Set<string> = new Set();
  Object.values(projectsData).forEach(({ region }) => {
    if (!(region in regions)) {
      regions.add(region);
    }
  });

  await db
    .insertInto("administrative_unit")
    .values([...regions].map((title) => ({ title })))
    .execute();
}
