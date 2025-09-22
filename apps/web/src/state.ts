import { createAPIClient } from "@shared/api";
import * as types from "./types";

export default class State {
  private apiClient;
  public projects: types.Project[] = [];
  public cities: types.AdministrativeUnit[] = [];
  public feedbackTypes: types.FeedbackType[] = [];
  public categories: types.TopicCategory[] = [];

  constructor() {
    this.apiClient = createAPIClient({
      apiPath: "/api",
      serverUrl: "http://localhost:3000",
    });
  }

  public async init() {
    this.projects = await this.apiClient.project.all({
      administrative_unit_type: "town",
    });
    this.cities = await this.apiClient.administrativeUnit.all({
      type: "town",
    });
    this.categories = await this.apiClient.topicCategory.all();
    this.feedbackTypes = await this.apiClient.feedbackType.all();
  }

  public async loadIssues(
    categoryId: number | string,
  ): Promise<types.TopicCategoryTopic[]> {
    return await this.apiClient.topicCategoryTopic.all({
      filter_by: "category",
      field_id: String(categoryId),
    });
  }
}
