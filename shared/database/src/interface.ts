import * as entities from "./entities";

export interface Database {
  administrative_unit: entities.administrativeUnit.AdministrativeUnitTable;
  administrative_unit_type: entities.administrativeUnitType.AdministrativeUnitTypeTable;

  contact: entities.contact.ContactTable;
  contact_type: entities.contactType.ContactTypeTable;

  feedback: entities.feedback.FeedbackTable;
  feedback_status: entities.feedbackStatus.FeedbackStatusTable;
  feedback_image: entities.feedbackImage.FeedbackImageTable;
  feedback_topic: entities.feedbackTopic.FeedbackTopicTable;
  feedback_topic_category: entities.feedbackTopicCategory.FeedbackTopicCategoryTable;
  feedback_type: entities.feedbackType.FeedbackTypeTable;

  person: entities.person.PersonTable;
  person_type: entities.personType.PersonTypeTable;

  person_contact: entities.personContact.PersonContactTable;
  official_responsibility: entities.officialResponsibility.OfficialResponsibilityTable;
  feedback_topic_category_topic: entities.feedbackTopicCategoryTopic.FeedbackTopicCategoryTopicTable;

  project: entities.project.ProjectTable;
}
