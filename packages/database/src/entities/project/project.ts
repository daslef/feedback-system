import type { Generated, Insertable, Updateable, Selectable } from "kysely";

export interface ProjectTable {
  id: Generated<number>;
  title: string;
  latitude: number;
  longitude: number;
  year_of_completion: number;
  administrative_unit_id: number;
  created_at: Generated<number>;
}

export type Project = Selectable<ProjectTable>;
export type NewProject = Insertable<ProjectTable>;
export type UpdateProject = Updateable<ProjectTable>;
