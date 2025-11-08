import { type Generated } from "kysely";

import { type AdministrativeUnitTable } from "@shared/schema/administrative_unit";
import { type AdministrativeUnitTypeTable } from "@shared/schema/administrative_unit_type";
import { type PersonTable } from "@shared/schema/person";
import { type PersonTypeTable } from "@shared/schema/person_type";
import { type PersonContactTable } from "@shared/schema/person_contact";
import { type FeedbackTable } from "@shared/schema/feedback";
import { type FeedbackStatusTable } from "@shared/schema/feedback_status";
import { type FeedbackImageTable } from "@shared/schema/feedback_image";
import { type FeedbackTypeTable } from "@shared/schema/feedback_type";
import { type TopicTable } from "@shared/schema/topic";
import { type TopicCategoryTable } from "@shared/schema/topic_category";
import { type TopicCategoryTopicTable } from "@shared/schema/topic_category_topic";
import { type OfficialResponsibilityTable } from "@shared/schema/official_responsibility";
import { type ProjectTable } from "@shared/schema/project";
import { type VotingUnitTable } from "@shared/schema/voting_unit";
import { type VotingRegionTable } from "@shared/schema/voting_region";
import { type VotingVoteTable } from "@shared/schema/voting_vote";

type GeneratedId = {
  id: Generated<number>;
};

type GeneratedTime = {
  created_at: Generated<string>;
};

export interface Database {
  administrative_unit: AdministrativeUnitTable & GeneratedId;
  administrative_unit_type: AdministrativeUnitTypeTable & GeneratedId;
  project: ProjectTable & GeneratedId & GeneratedTime;
  topic: TopicTable & GeneratedId;
  topic_category: TopicCategoryTable & GeneratedId;
  topic_category_topic: TopicCategoryTopicTable & GeneratedId;
  person: PersonTable & GeneratedId;
  person_type: PersonTypeTable & GeneratedId;
  person_contact: PersonContactTable & GeneratedId;
  feedback: FeedbackTable & GeneratedId & GeneratedTime;
  feedback_status: FeedbackStatusTable & GeneratedId;
  feedback_image: FeedbackImageTable & GeneratedId;
  feedback_type: FeedbackTypeTable & GeneratedId;
  official_responsibility: OfficialResponsibilityTable & GeneratedId;
  voting_region: VotingRegionTable & GeneratedId;
  voting_unit: VotingUnitTable & GeneratedId;
  voting_vote: VotingVoteTable & GeneratedId & GeneratedTime;
}
