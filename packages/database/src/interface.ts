import * as entities from "./entities";

export interface Database {
  project: entities.project.ProjectTable;
  administrative_unit: entities.administrativeUnit.AdministrativeUnitTable;
  feedback: entities.feedback.FeedbackTable;
  feedback_status: entities.feedbackStatus.FeedbackStatusTable;
  feedback_image: entities.feedbackImage.FeedbackImageTable;
  person: entities.person.PersonTable;
  person_type: entities.personType.PersonTypeTable;
  person_contact: entities.personContact.PersonContactTable;
  contact: entities.contact.ContactTable;
  contact_type: entities.contactType.ContactTypeTable;
  official_responsibility: entities.officialResponsibility.OfficialResponsibilityTable;
}
