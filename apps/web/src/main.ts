function showAlert(message: string) {
  const alert = document.getElementById("customAlert") as HTMLElement;
  const messageElement = alert.querySelector(".alert-message") as HTMLElement;
  const iconElement = alert.querySelector(".alert-icon") as HTMLElement;

  messageElement.textContent = message;
  iconElement.textContent = "⚠️";
  alert.classList.remove("success");
  alert.classList.add("show");

  setTimeout(() => {
    closeAlert();
  }, 5000);
}

function closeAlert() {
  const alert = document.getElementById("customAlert");
  alert?.classList.remove("show", "success");
}

function showSuccessAlert(message: string) {
  const alert = document.getElementById("customAlert") as HTMLElement;
  const messageElement = alert.querySelector(".alert-message") as HTMLElement;
  const iconElement = alert.querySelector(".alert-icon") as HTMLElement;

  messageElement.textContent = message;
  iconElement.textContent = "✅";
  alert.classList.add("show", "success");

  setTimeout(() => {
    closeAlert();
  }, 5000);
}

function validateForm() {
  const requiredFields = [
    ...document.querySelectorAll('[data-required="1"]'),
  ] as HTMLInputElement[];
  const emptyFields: HTMLInputElement[] = [];

  requiredFields.forEach((field) => {
    const formBlock = field.closest(".form-block") as HTMLElement;
    const isFieldVisible = formBlock && formBlock.style.display !== "none";

    if (field.id === "dragDropArea") {
      const fileInput = document.getElementById(
        "fileInput",
      ) as HTMLInputElement;
      const fileList = document.getElementById("fileList") as HTMLElement;
      const hasFiles = fileInput.files && fileInput.files.length > 0;
      const hasFileListItems = fileList && fileList.children.length > 0;

      if (isFieldVisible && !hasFiles && !hasFileListItems) {
        emptyFields.push(field);
      }
    } else if (isFieldVisible && !field.value.trim()) {
      emptyFields.push(field);
    }
  });

  if (emptyFields.length > 0) {
    const fieldNames = emptyFields.map((field) => {
      if (field.id === "dragDropArea") {
        return "Прикрепить файлы";
      }
      const label = field
        .closest(".form-block")
        ?.querySelector(".form-block-title");

      return label ? label.textContent?.trim() : "Поле";
    });

    const message = `Пожалуйста, заполните обязательные поля: ${fieldNames.join(
      ", ",
    )}`;

    showAlert(message);
    return false;
  }

  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".apply-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      if (!validateForm()) {
        e.preventDefault();
      }
    });
  }
});

declare const ymaps: any;

let map: any;
let selectedCity: any = null;
let selectedProject: any = null;
let cityMarkers: any[] = [];
let projectMarkers: any[] = [];

function openMapPopup() {
  const popup = document.getElementById("mapPopup") as HTMLElement;
  popup.classList.add("show");
  document.body.style.overflow = "hidden";

  if (!map) {
    initYandexMap();
  } else {
    setTimeout(() => {
      try {
        map.container.fitToViewport();
      } catch { }
    }, 100);
  }
}

function closeMapPopup() {
  const popup = document.getElementById("mapPopup") as HTMLElement;
  popup.classList.remove("show");
  document.body.style.overflow = "";
}

function initYandexMap() {
  if (!window.ymaps) {
    console.error("Яндекс.Карты не загружены");
    return;
  }

  ymaps.ready(function () {
    map = new ymaps.Map("yandexMap", {
      center: [60.5, 30],
      zoom: 6,
      controls: ["zoomControl", "fullscreenControl"],
    });

    loadCities();

    window.addEventListener("resize", () => {
      try {
        map.container.fitToViewport();
      } catch { }
    });
  });
}

async function loadCities() {
  try {
    const [citiesResponse, projectsResponse] = await Promise.all([
      fetch("http://localhost:3000/api/administrative_units?type=town"),
      fetch("http://localhost:3000/api/projects?administrative_unit_type=town"),
    ]);

    const cities = await citiesResponse.json();
    const projects = await projectsResponse.json();

    const projectsByCity = projects.reduce((acc: any, project: any) => {
      if (!acc[project.administrative_unit_id]) {
        acc[project.administrative_unit_id] = [];
      }
      acc[project.administrative_unit_id].push(project);
      return acc;
    }, {});

    cities.forEach((city: any) => {
      const cityProjects = projectsByCity[city.id] || [];

      if (cityProjects.length > 0) {
        const avgLat =
          cityProjects.reduce((sum: number, p: any) => sum + p.latitude, 0) /
          cityProjects.length;
        const avgLng =
          cityProjects.reduce((sum: number, p: any) => sum + p.longitude, 0) /
          cityProjects.length;

        const coords = [avgLat, avgLng];

        const marker = new ymaps.Placemark(
          coords,
          {
            balloonContent: `<div><strong>${city.title}</strong><br>Проектов: ${cityProjects.length}</div>`,
          },
          {
            preset: "islands#greenDotIcon",
            iconColor: "#18a763",
          },
        );

        marker.events.add("click", function () {
          selectCity(city);
        });

        map.geoObjects.add(marker);
        cityMarkers.push(marker);
      }
    });
  } catch (error) {
    console.error("Ошибка загрузки городов:", error);
  }
}

async function selectCity(city: any) {
  selectedCity = city;
  selectedProject = null;

  const selectedCityElement = document.getElementById("selectedCityName");
  const selectedProjectElement = document.getElementById("selectedProjectName");

  if (selectedCityElement && selectedProjectElement) {
    selectedCityElement.textContent = city.title;
    selectedProjectElement.textContent = "Не выбран";
  }

  try {
    const response = await fetch("http://localhost:3000/api/projects?administrative_unit_type=town");
    const projects = await response.json();
    const cityProjects = projects.filter(
      (project: any) => project.administrative_unit_id === city.id,
    );

    if (cityProjects.length > 0) {
      const avgLat =
        cityProjects.reduce((sum: number, p: any) => sum + p.latitude, 0) /
        cityProjects.length;
      const avgLng =
        cityProjects.reduce((sum: number, p: any) => sum + p.longitude, 0) /
        cityProjects.length;
      const coords = [avgLat, avgLng];
      map.setCenter(coords, 10);
    }
  } catch (error) {
    console.error("Ошибка получения координат города:", error);
  }

  loadProjectsForCity(city.id);
}

async function loadProjectsForCity(cityId: number) {
  projectMarkers.forEach((marker) => {
    map.geoObjects.remove(marker);
  });
  projectMarkers = [];

  try {
    const response = await fetch("http://localhost:3000/api/projects?administrative_unit_type=town");
    const projects = await response.json();

    const cityProjects = projects.filter(
      (project: any) => project.administrative_unit_id === cityId,
    );

    if (cityProjects.length > 0) {
      cityProjects.forEach((project: any) => {
        const coords = [project.latitude, project.longitude];
        const marker = new ymaps.Placemark(
          coords,
          {
            balloonContent: `<div><strong>${project.title}</strong></div>`,
          },
          {
            preset: "islands#blueDotIcon",
            iconColor: "#48c5df",
          },
        );

        marker.events.add("click", function () {
          selectProject(project);
        });

        map.geoObjects.add(marker);
        projectMarkers.push(marker);
      });
    }
  } catch (error) {
    console.error("Ошибка загрузки проектов:", error);
  }
}

function selectProject(project: any) {
  selectedProject = project;
  (
    document.getElementById("selectedProjectName") as HTMLSpanElement
  ).textContent = project.title;
}

async function loadProjectsForSelect(
  cityId: string | number,
  callback: Function,
) {
  try {
    const response = await fetch("http://localhost:3000/api/projects?administrative_unit_type=town");
    const projects = await response.json();

    const projectSelect = document.getElementById(
      "projectSelect",
    ) as HTMLSelectElement;
    projectSelect.innerHTML = '<option value="">Выберите проект</option>';

    const cityProjects = projects.filter(
      (project: any) =>
        project.administrative_unit_id.toString() === cityId.toString(),
    );

    if (cityProjects.length > 0) {
      cityProjects.forEach((project: any) => {
        const option = document.createElement("option");
        option.value = project.id.toString();
        option.textContent = project.title;
        projectSelect.appendChild(option);
      });
    }

    if (callback) callback();
  } catch (error) {
    console.error("Ошибка загрузки проектов для селекта:", error);
    if (callback) callback();
  }
}

function applyMapSelection() {
  if (!selectedCity || !selectedProject) {
    showAlert("Пожалуйста, выберите город и проект на карте");
    return;
  }

  const citySelect = document.getElementById("citySelect") as HTMLSelectElement;
  const projectSelect = document.getElementById(
    "projectSelect",
  ) as HTMLSelectElement;

  if (!citySelect || !projectSelect) {
    console.error("Не найдены элементы select для города или проекта");
    return;
  }

  for (let option of citySelect.options) {
    if (option.textContent === selectedCity.title) {
      citySelect.value = option.value;
      break;
    }
  }

  loadProjectsForSelect(selectedCity.id, () => {
    for (let option of projectSelect.options) {
      if (option.textContent === selectedProject.title) {
        projectSelect.value = option.value;
        break;
      }
    }

    closeMapPopup();

    showSuccessAlert(
      `Выбран город: ${selectedCity.title}, проект: ${selectedProject.title}`,
    );
  });
}

window.openMapPopup = openMapPopup;

let categories: any[] = [];

async function loadDropdownData() {
  try {
    const response = await fetch("http://localhost:3000/api/topic_categories");
    categories = await response.json();
  } catch (error) {
    console.error("Ошибка загрузки данных dropdown:", error);
  }
}

function handleRequestTypeChange() {
  const requestTypeSelect = document.getElementById(
    "requestTypeSelect",
  ) as HTMLSelectElement;
  const categoryBlock = document.getElementById(
    "categoryBlock",
  ) as HTMLDivElement;
  const issueBlock = document.getElementById("issueBlock") as HTMLDivElement;

  if (requestTypeSelect.value === "2") {
    categoryBlock.style.display = "block";
    issueBlock.style.display = "block";
    populateCategories();
  } else {
    categoryBlock.style.display = "none";
    issueBlock.style.display = "none";
    const categorySelect = document.getElementById(
      "categorySelect",
    ) as HTMLSelectElement;
    const issueSelect = document.getElementById(
      "issueSelect",
    ) as HTMLSelectElement;
    if (categorySelect) categorySelect.value = "";
    if (issueSelect) issueSelect.value = "";
  }
}

function populateCategories() {
  const select = document.getElementById("categorySelect") as HTMLSelectElement;
  select.innerHTML = '<option value="">Выберите категорию</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id.toString();
    option.textContent = category.title;
    select.appendChild(option);
  });
}

function handleCategoryChange() {
  const categorySelect = document.getElementById(
    "categorySelect",
  ) as HTMLSelectElement;
  const issueSelect = document.getElementById(
    "issueSelect",
  ) as HTMLSelectElement;

  if (categorySelect.value) {
    populateIssues(categorySelect.value);
  } else {
    issueSelect.innerHTML =
      '<option value="">Сначала выберите категорию</option>';
  }
}

async function populateIssues(categoryId: number | string) {
  const select = document.getElementById("issueSelect") as HTMLSelectElement;
  select.innerHTML = '<option value="">Выберите проблему</option>';

  try {
    const response = await fetch(
      `http://localhost:3000/api/topic_category_topics?filter_by=category&field_id=${categoryId}`,
    );
    const issues = await response.json();

    issues.forEach((issue: any) => {
      const option = document.createElement("option");
      option.value = issue.id.toString();
      option.textContent = issue.feedback_topic;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Ошибка загрузки тем для категории:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadDropdownData();

  const requestTypeSelect = document.getElementById(
    "requestTypeSelect",
  ) as HTMLSelectElement;
  const categorySelect = document.getElementById(
    "categorySelect",
  ) as HTMLSelectElement;
  const alertCloseButton = document.querySelector(
    "#customAlert .alert-close",
  ) as HTMLButtonElement;
  const mapPopupOverlayElement = document.querySelector(
    "#mapPopup .map-popup-overlay",
  ) as HTMLDivElement;
  const mapPopupCloseElement = document.querySelector(
    "#mapPopup .map-popup-close",
  ) as HTMLButtonElement;
  const [mapApplySelectionElement, mapCancelElement] =
    document.querySelectorAll(".map-popup-footer > button");

  if (requestTypeSelect) {
    requestTypeSelect.addEventListener("change", handleRequestTypeChange);
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", handleCategoryChange);
  }

  alertCloseButton.addEventListener("click", closeAlert);
  mapApplySelectionElement?.addEventListener("click", applyMapSelection);

  mapPopupOverlayElement.addEventListener("click", closeMapPopup);
  mapPopupCloseElement.addEventListener("click", closeMapPopup);
  mapCancelElement?.addEventListener("click", closeMapPopup);
});
