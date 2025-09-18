import { Generated } from "kysely";
import { type AdministrativeUnitTable } from "@shared/schema/administrative_unit";
import { type AdministrativeUnitTypeTable } from "@shared/schema/administrative_unit_type";
import { type PersonTable } from "@shared/schema/person";
import { type PersonTypeTable } from "@shared/schema/person_type";
import { type PersonContactTable } from "@shared/schema/person_contact";
import { type FeedbackTable } from "@shared/schema/feedback";
import { type FeedbackStatusTable } from "@shared/schema/feedback_status";
import { FeedbackImageTable } from "@shared/schema/feedback_image";
import { type FeedbackTypeTable } from "@shared/schema/feedback_type";
import { type FeedbackTopicTable } from "@shared/schema/feedback_topic";
import { type FeedbackTopicCategoryTable } from "@shared/schema/feedback_topic_category";
import { type FeedbackTopicCategoryTopicTable } from "@shared/schema/feedback_topic_category_topic";
import { type OfficialResponsibilityTable } from "@shared/schema/official_responsibility";
import { type ProjectTable } from "@shared/schema/project";

type GeneratedId = {
  id: Generated<number>;
};

export interface Database {
  administrative_unit: AdministrativeUnitTable & GeneratedId;
  administrative_unit_type: AdministrativeUnitTypeTable & GeneratedId;
  project: ProjectTable & GeneratedId;
  feedback_topic: FeedbackTopicTable & GeneratedId;
  feedback_topic_category: FeedbackTopicCategoryTable & GeneratedId;
  feedback_topic_category_topic: FeedbackTopicCategoryTopicTable & GeneratedId;

  // TODO rewrite upcoming types
  person: PersonTable;
  person_type: PersonTypeTable;
  person_contact: PersonContactTable;
  feedback: FeedbackTable;
  feedback_status: FeedbackStatusTable;
  feedback_image: FeedbackImageTable;
  feedback_type: FeedbackTypeTable;
  official_responsibility: OfficialResponsibilityTable;
}
