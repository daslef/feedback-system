declare const ymaps: any;

import type { ApiClient } from "./api-client";
import * as types from "./types";

type MapsManagerProperties = {
  apiClient: ApiClient,
  alertManager: types.AlertManagerInterface
}

type OpenMethodProperties = { selectedTownId: string, selectedProjectId: string }


export default class MapsManager {
  private popupElement: HTMLElement;
  private selectedCityElement: HTMLElement;
  private selectedProjectElement: HTMLElement;
  private mapPopupOverlayElement: HTMLDivElement;
  private mapPopupCloseElement: HTMLButtonElement;
  private mapApplySelectionElement: HTMLButtonElement;
  private mapCancelElement: HTMLButtonElement;

  private apiClient: ApiClient;
  private alertManager: any;

  private map: any;
  private projects: any;
  private selectedProject: any = null;

  constructor({ apiClient, alertManager }: MapsManagerProperties) {
    this.popupElement = document.getElementById("mapPopup") as HTMLElement;
    this.selectedCityElement = document.getElementById(
      "selectedCityName",
    ) as HTMLElement;
    this.selectedProjectElement = document.getElementById(
      "selectedProjectName",
    ) as HTMLElement;
    this.mapPopupOverlayElement = document.querySelector(
      ".map-popup-overlay",
    ) as HTMLDivElement;
    this.mapPopupCloseElement = document.querySelector(
      ".map-popup-close",
    ) as HTMLButtonElement;

    const [mapApplySelectionElement, mapCancelElement] =
      document.querySelectorAll(".map-popup-footer > button");
    this.mapApplySelectionElement = mapApplySelectionElement as HTMLButtonElement;
    this.mapCancelElement = mapCancelElement as HTMLButtonElement;

    this.apiClient = apiClient
    this.alertManager = alertManager

    this.init();
  }

  private init() {
    ymaps.ready(() => {
      this.map = new ymaps.Map("yandexMap", {
        center: [60.5, 30],
        zoom: 6,
        controls: ["zoomControl", "fullscreenControl"],
      });

      this.setupEventListeners()
      this.loadProjects()
    });
  }

  private async zoomToTown(townId: any) {
    const townProjects = this.projects.filter(
      (project: any) => project.administrative_unit_id === +townId,
    );

    this.selectedProjectElement.textContent = "Не выбран";

    const avgLat =
      townProjects.reduce((sum: number, p: any) => sum + p.latitude, 0) /
      townProjects.length;
    const avgLng =
      townProjects.reduce((sum: number, p: any) => sum + p.longitude, 0) /
      townProjects.length;

    const coords = [avgLat, avgLng];
    this.map.setCenter(coords, 12);
  }

  private async zoomToProject(projectId: any) {
    const project = this.projects.find(project => project.id === +projectId)
    this.selectedProjectElement.textContent = project.title;
    this.map.setCenter([project.latitude, project.longitude], 15);
  }

  private async loadProjects() {
    try {
      this.projects = await this.apiClient.project.all({
        administrative_unit_type: "town",
      });

      this.projects.forEach((project: any) => {
        const coords = [project.latitude, project.longitude];
        const marker = new ymaps.Placemark(
          coords,
          {
            preset: "islands#blueDotIcon",
            iconColor: "#48c5df",
          },
        );

        marker.events.add("click", () => {
          this.selectProject(project);
        });

        this.map.geoObjects.add(marker);
      });
    } catch (error) {
      console.error("Ошибка загрузки проектов:", error);
    }
  }

  private selectProject(project: any) {
    this.selectedProject = project;
    (
      document.getElementById("selectedProjectName") as HTMLSpanElement
    ).textContent = project.title;
  }

  private applyMapSelection() {
    if (!this.selectedProject) {
      this.alertManager.showAlert("Пожалуйста, выберите город и проект на карте");
      return;
    }

    const citySelect = document.getElementById("citySelect") as HTMLSelectElement;
    const projectSelect = document.getElementById(
      "projectSelect",
    ) as HTMLSelectElement;

    for (const option of citySelect.options) {
      if (option.value == this.selectedProject.administrative_unit_id) {
        citySelect.value = option.value;
        break;
      }
    }

    for (const option of projectSelect.options) {
      if (option.value == this.selectedProject.id) {
        projectSelect.value = option.value;
        break;
      }
    }

    this.alertManager.showAlert(
      `Выбран город: ${this.selectedProject.administrative_unit_id}, проект: ${this.selectedProject.title}`,
      "success"
    );

    this.close();
  }

  public open({ selectedTownId, selectedProjectId }: OpenMethodProperties) {
    this.popupElement.classList.add("show");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      this.map.container.fitToViewport();
    }, 100);


    if (selectedProjectId) {
      this.zoomToProject(selectedProjectId)
    } else if (selectedTownId) {
      this.zoomToTown(selectedTownId)
    }
  }

  public close() {
    this.popupElement.classList.remove("show");
    document.body.style.overflow = "";
  }

  private setupEventListeners() {
    this.mapApplySelectionElement.addEventListener("click", () => this.applyMapSelection());
    this.mapPopupCloseElement.addEventListener("click", () => this.close());
    this.mapCancelElement?.addEventListener("click", () => this.close());

    window.addEventListener("resize", () => {
      this.map.container.fitToViewport();
    });
  }
}