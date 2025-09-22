export interface AlertManagerInterface {
  showAlert: (message: string, type?: "success" | "warning") => void;
  closeAlert: () => void;
}

export interface Project {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  year_of_completion: number;
  administrative_unit_id: number;
  administrative_unit: string;
}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  person_type_id: number;
  person_type: "citizen" | "official" | "moderator";
}

export interface AdministrativeUnit {
  id: number;
  title: string;
  unit_type: "settlement" | "town";
}

export interface TopicCategory {
  id: number;
  title: string;
}

export interface FeedbackType {
  id: number;
  title: string;
}

export interface TopicCategoryTopic {
  id: number;
  topic: string;
  topic_category: string;
}

export interface FeedbackIn {
  project_id: number;
  description: string;
  feedback_type_id: number;
  topic_id: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  email: string;
  phone?: string;
  files: File[];
}

export interface Contact {
  id: number;
  value: string;
  contact_type_id: number;
  person_id: number;
}
