import type { Generated } from "kysely";
import type { project, administrativeUnit, projectType } from "./entities";

export interface Database {
  project: project.ProjectTable;
  administrative_unit: administrativeUnit.AdministrativeUnitTable;
  project_type: projectType.ProjectTypeTable;
  feedback: {
    id: Generated<number>;
    project_id: number;
    description: string;
    person_contact_id: number;
    created_at: string;
    feedback_status_id: number;
  };

  feedback_status: {
    id: Generated<number>;
    status: string;
  };

  feedback_image: {
    id: Generated<number>;
    feedback_id: number;
    link_to_s3: string;
  };

  person: {
    id: Generated<number>;
    first_name: string;
    last_name: string;
    middle_name: string;
    person_type_id: number;
  };

  person_type: {
    id: Generated<number>;
    title: string;
  };

  person_contact: {
    id: Generated<number>;
    contact_type_id: number;
    person_id: number;
  };

  contact: {
    id: Generated<number>;
    contact_type_id: number;
    value: string;
    person_id: number;
  };

  contact_type: {
    id: Generated<number>;
    title: string;
  };

  official_responsibility: {
    id: Generated<number>;
    project_type_id: number;
    administrative_unit_id: number;
    official_id: number;
  };
}
