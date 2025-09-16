import * as entities from "./entities";

export interface Database {
  administrative_unit: entities.administrativeUnit.AdministrativeUnitTable;
  administrative_unit_type: entities.administrativeUnitType.AdministrativeUnitTypeTable;

  person: entities.person.PersonTable;
  person_type: entities.personType.PersonTypeTable;
  person_contact: entities.personContact.PersonContactTable;

  feedback: entities.feedback.FeedbackTable;
  feedback_status: entities.feedbackStatus.FeedbackStatusTable;
  feedback_image: entities.feedbackImage.FeedbackImageTable;
  feedback_type: entities.feedbackType.FeedbackTypeTable;

  feedback_topic: entities.feedbackTopic.FeedbackTopicTable;
  feedback_topic_category: entities.feedbackTopicCategory.FeedbackTopicCategoryTable;
  feedback_topic_category_topic: entities.feedbackTopicCategoryTopic.FeedbackTopicCategoryTopicTable;

  official_responsibility: entities.officialResponsibility.OfficialResponsibilityTable;

  project: entities.project.ProjectTable;
}
