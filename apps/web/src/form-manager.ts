import { type ApiClient } from "./api-client";
import * as types from "./types";

type FormManagerProperties = {
  apiClient: ApiClient;
  alertManager: types.AlertManagerInterface;
};

export default class FormManager {
  public citySelect: HTMLSelectElement;
  public projectSelect: HTMLSelectElement;
  private requestTypeSelect: HTMLSelectElement;
  private categorySelect: HTMLSelectElement;
  private issueSelect: HTMLSelectElement;
  private categoryContainer = document.getElementById(
    "categoryBlock",
  ) as HTMLDivElement;
  private issueContainer = document.getElementById(
    "issueBlock",
  ) as HTMLDivElement;

  private form: HTMLFormElement;
  private projects: types.Project[] = [];
  private cities: types.AdministrativeUnit[] = [];
  private feedbackTypes: types.FeedbackType[] = [];
  private categories: types.FeedbackTopicCategory[] = [];
  private apiClient: ApiClient;
  private alertManager: types.AlertManagerInterface;

  constructor({ apiClient, alertManager }: FormManagerProperties) {
    this.citySelect = document.getElementById(
      "citySelect",
    ) as HTMLSelectElement;
    this.projectSelect = document.getElementById(
      "projectSelect",
    ) as HTMLSelectElement;
    this.requestTypeSelect = document.getElementById(
      "requestTypeSelect",
    ) as HTMLSelectElement;
    this.categorySelect = document.getElementById(
      "categorySelect",
    ) as HTMLSelectElement;
    this.issueSelect = document.getElementById(
      "issueSelect",
    ) as HTMLSelectElement;

    this.form = document.querySelector(".apply-form") as HTMLFormElement;
    this.apiClient = apiClient;
    this.alertManager = alertManager;
    this.init();
  }

  private async init(): Promise<void> {
    await this.loadCities();
    await this.loadProjects();
    await this.loadCategories();
    await this.loadTypes();
    this.setupEventListeners();
  }

  private async loadCities(): Promise<void> {
    try {
      this.cities = await this.apiClient.administrativeUnit.all({
        type: "town",
      });
      this.citySelect.innerHTML = '<option value="">Выберите город</option>';
      this.cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.id.toString();
        option.textContent = city.title;
        this.citySelect.appendChild(option);
      });
    } catch {
      this.alertManager.showAlert(
        "Ошибка загрузки списка городов. Попробуйте обновить страницу.",
      );
    }
  }

  private async loadProjects(): Promise<void> {
    try {
      this.projects = await this.apiClient.project.all({
        administrative_unit_type: "town",
      });
    } catch {
      this.alertManager.showAlert(
        "Ошибка загрузки списка проектов. Попробуйте обновить страницу.",
      );
    }
  }

  private async loadCategories(): Promise<void> {
    try {
      this.categories = await this.apiClient.feedbackTopicCategory.all();

      this.categorySelect.innerHTML =
        '<option value="">Выберите категорию</option>';

      this.categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id.toString();
        option.textContent = category.title;
        this.categorySelect.appendChild(option);
      });
    } catch {
      this.alertManager.showAlert(
        "Ошибка загрузки списка категорий. Попробуйте обновить страницу.",
      );
    }
  }

  private async loadIssues(categoryId: number | string) {
    this.issueSelect.innerHTML = '<option value="">Выберите проблему</option>';

    try {
      const issues = await this.apiClient.feedbackTopicCategoryTopic.all({
        filter_by: "category",
        field_id: String(categoryId),
      });

      issues.forEach((issue: any) => {
        const option = document.createElement("option");
        option.value = issue.id.toString();
        option.textContent = issue.feedback_topic;
        this.issueSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Ошибка загрузки тем для категории:", error);
    }
  }

  private async loadTypes(): Promise<void> {
    try {
      this.feedbackTypes = await this.apiClient.feedbackType.all();
      this.requestTypeSelect.innerHTML = "";
      this.feedbackTypes.forEach(({ id, title }) => {
        const feedbackTypeSelect = document.createElement("option");
        feedbackTypeSelect.textContent = title;
        feedbackTypeSelect.value = String(id);
        this.requestTypeSelect.appendChild(feedbackTypeSelect);
      });
    } catch {
      this.alertManager.showAlert(
        "Ошибка загрузки списка категорий. Попробуйте обновить страницу.",
      );
    }
  }

  private loadProjectsForCity(cityId: string): void {
    this.projectSelect.innerHTML = '<option value="">Выберите проект</option>';

    const cityProjects = this.projects.filter(
      (project) => project.administrative_unit_id.toString() === cityId,
    );

    if (!cityProjects.length) {
      this.projectSelect.innerHTML =
        '<option value="">Проекты не найдены</option>';
      return;
    }

    for (const project of cityProjects) {
      const option = document.createElement("option");
      option.value = project.id.toString();
      option.textContent = project.title;
      this.projectSelect.appendChild(option);
    }
  }

  private setupEventListeners(): void {
    this.citySelect.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      if (target.value) {
        this.loadProjectsForCity(target.value);
      } else {
        this.projectSelect.innerHTML =
          '<option value="">Сначала выберите город</option>';
      }
    });

    this.requestTypeSelect.addEventListener("change", () => {
      if (this.requestTypeSelect.value === "2") {
        this.categoryContainer.style.display = "block";
        this.issueContainer.style.display = "block";
      } else {
        this.categoryContainer.style.display = "none";
        this.issueContainer.style.display = "none";
        this.categorySelect.value = "";
        this.issueSelect.value = "";
      }
    });

    this.categorySelect.addEventListener("change", () => {
      if (this.categorySelect.value) {
        this.loadIssues(this.categorySelect.value);
        return;
      }

      this.issueSelect.innerHTML =
        '<option value="">Сначала выберите категорию</option>';
    });

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }

  private handleFormSubmit(): void {
    const formData = new FormData(this.form);

    const formDataObject: any = {};
    for (const [key, value] of formData.entries()) {
      if (key === "personal_data_agreement") {
        continue;
      }
      formDataObject[key] = value;
    }

    formDataObject.files = this.selectedFiles;
    // .map((file) => ({
    //   name: file.name,
    //   size: file.size,
    //   type: file.type,
    // }));

    console.log("Данные формы:", formDataObject);
  }
}
