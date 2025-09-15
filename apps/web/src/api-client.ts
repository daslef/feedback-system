const API_BASE_URL = 'http://localhost:3000/api';

export interface Project {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  year_of_completion: number;
  administrative_unit_id: number;
  created_at: string;
}

export interface AdministrativeUnit {
  id: number;
  title: string;
  unit_type: 'settlement' | 'town';
}

export interface FeedbackTopicCategory {
  id: number;
  title: string;
}

export interface TopicCategoryTopic {
  id: number;
  feedback_topic: string;
  feedback_topic_category: string;
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async getAdministrativeUnits(): Promise<AdministrativeUnit[]> {
    return this.request<AdministrativeUnit[]>('/administrative_units');
  }

  async getFeedbackTopicCategories(): Promise<FeedbackTopicCategory[]> {
    return this.request<FeedbackTopicCategory[]>('/topic_categories');
  }

  async getTopicsByCategory(categoryId: number): Promise<TopicCategoryTopic[]> {
    return this.request<TopicCategoryTopic[]>(`/topic_category_topics?filter_by=category&field_id=${categoryId}`);
  }
}

export const apiClient = new ApiClient();
