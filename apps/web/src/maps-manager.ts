declare const ymaps: any;

import type State from "./state";
import * as types from "./types";

type MapsManagerProperties = {
  state: State;
};

type OpenMethodProperties = {
  selectedTownId: string | null;
  selectedProjectId: string | null;
};

export default class MapsManager {
  private popupElement: HTMLElement;
  private selectedCityElement: HTMLElement;
  private selectedProjectElement: HTMLElement;
  private mapPopupCloseElement: HTMLButtonElement;
  private mapApplySelectionElement: HTMLButtonElement;
  private mapCancelElement: HTMLButtonElement;

  private state: State;
  private map: any;
  private selectedProject: types.Project | null = null;

  constructor({ state }: MapsManagerProperties) {
    this.popupElement = document.getElementById("mapPopup") as HTMLElement;
    this.selectedCityElement = document.getElementById(
      "selectedCityName",
    ) as HTMLElement;
    this.selectedProjectElement = document.getElementById(
      "selectedProjectName",
    ) as HTMLSpanElement;
    this.mapPopupCloseElement = document.querySelector(
      ".map-popup-close",
    ) as HTMLButtonElement;

    const [mapApplySelectionElement, mapCancelElement] =
      document.querySelectorAll(".map-popup-footer > button");
    this.mapApplySelectionElement =
      mapApplySelectionElement as HTMLButtonElement;
    this.mapCancelElement = mapCancelElement as HTMLButtonElement;

    this.state = state;

    this.init();
  }

  private init() {
    ymaps.ready(() => {
      this.map = new ymaps.Map("yandexMap", {
        center: [60.5, 30],
        zoom: 6,
        controls: [
          "zoomControl",
          "fullscreenControl",
          "searchControl",
          "geolocationControl",
        ],
      });

      this.setupEventListeners();
      this.loadProjects();
    });
  }

  private async zoomToTown(townId: string) {
    const townProjects = this.state.projects.filter(
      (project: types.Project) =>
        project.administrative_unit_id === Number(townId),
    );

    this.selectedProjectElement.textContent = "Не выбран";

    const avgLat =
      townProjects.reduce(
        (sum: number, p: types.Project) => sum + p.latitude,
        0,
      ) / townProjects.length;

    const avgLng =
      townProjects.reduce(
        (sum: number, p: types.Project) => sum + p.longitude,
        0,
      ) / townProjects.length;

    const coords = [avgLat, avgLng];
    this.map.setCenter(coords, 12);
  }

  private async zoomToProject(projectId: string) {
    const project = this.state.projects.find(
      (project) => project.id === Number(projectId),
    )!;

    this.selectedCityElement.textContent = project.administrative_unit;
    this.selectedProjectElement.textContent = `${project.title} (${project.year_of_completion})`;
    this.map.setCenter([project.latitude, project.longitude], 15);
  }

  private async loadProjects() {
    this.state.projects.forEach((project: any) => {
      const coords = [project.latitude, project.longitude];
      const marker = new ymaps.Placemark(
        coords,
        { draggable: false },
        {
          iconLayout: "default#image",
          iconImageHref: "/icons/map/02-1.svg",
          iconImageSize: [20, 20],
          iconImageOffset: [-10, -10],
        },
      );

      marker.events.add("click", (e: any) => {
        // marker.getMap().geoObjects.forEach((currentMarker) => {
        //   currentMarker.options.set(
        //     "iconImageHref",
        //     currentMarker === e.originalEvent.target
        //       ? "/icons/map/04-1.svg"
        //       : "/icons/map/02-1.svg",
        //   );
        // });
        this.selectedProject = project;
        this.selectedProjectElement.textContent = `${project.title} (${project.year_of_completion})`;
        this.selectedCityElement.textContent = project.administrative_unit;
      });

      this.map.geoObjects.add(marker);
    });
  }

  private applyMapSelection() {
    if (!this.selectedProject) {
      return;
    }

    const citySelect = document.getElementById(
      "citySelect",
    ) as HTMLSelectElement;

    const projectSelect = document.getElementById(
      "projectSelect",
    ) as HTMLSelectElement;

    citySelect.value = String(this.selectedProject.administrative_unit_id);
    citySelect.dispatchEvent(new Event("input"));

    projectSelect.value = String(this.selectedProject.id);
    projectSelect.dispatchEvent(new Event("input"));

    this.close();
  }

  public open({ selectedTownId, selectedProjectId }: OpenMethodProperties) {
    this.popupElement.classList.add("show");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      this.map.container.fitToViewport();
    }, 100);

    if (selectedProjectId) {
      this.zoomToProject(selectedProjectId);
    } else if (selectedTownId) {
      this.zoomToTown(+selectedTownId);
    }
  }

  public close() {
    this.popupElement.classList.remove("show");
    document.body.style.overflow = "";
  }

  private setupEventListeners() {
    this.mapApplySelectionElement.addEventListener("click", () =>
      this.applyMapSelection(),
    );
    this.mapPopupCloseElement.addEventListener("click", () => this.close());
    this.mapCancelElement?.addEventListener("click", () => this.close());

    window.addEventListener("resize", () => {
      this.map.container.fitToViewport();
    });
  }
}
