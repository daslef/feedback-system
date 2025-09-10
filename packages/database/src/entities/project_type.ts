import type { Generated, Insertable, Updateable, Selectable } from "kysely";

export interface ProjectTypeTable {
  id: Generated<number>;
  title: string;
}

export type ProjectType = Selectable<ProjectTypeTable>;
export type NewProjectType = Insertable<ProjectTypeTable>;
export type UpdateProjectType = Updateable<ProjectTypeTable>;
