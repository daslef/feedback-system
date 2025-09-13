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
  const requiredFields = [...document.querySelectorAll('[data-required="1"]')] as HTMLInputElement[];
  const emptyFields: HTMLInputElement[] = [];

  requiredFields.forEach((field) => {
    const formBlock = field.closest(".form-block") as HTMLElement;
    const isFieldVisible =
      formBlock && formBlock.style.display !== "none";

    if (field.id === "dragDropArea") {
      const fileInput = document.getElementById("fileInput") as HTMLInputElement;
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
      ", "
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

let map;
let selectedCity = null;
let selectedProject = null;
let cityMarkers = [];
let projectMarkers = [];

const cityCoordinates = {
  1: [55.7558, 37.6176],
  2: [59.9311, 30.3609],
  3: [55.0084, 82.9357],
  4: [56.8431, 60.6454],
  5: [55.8304, 49.0661],
  6: [56.2965, 43.9361],
  7: [55.1644, 61.4368],
  8: [53.2001, 50.15],
  9: [54.9885, 73.3242],
  10: [47.2357, 39.7015],
};

const projectCoordinates = {
  1: [55.7908, 37.6756],
  2: [55.7558, 37.6176],
  3: [55.8304, 37.64],
  4: [55.752, 37.6175],
  5: [59.944, 30.336],
  6: [59.94, 30.33],
  7: [59.95, 30.32],
  8: [55.0084, 82.9357],
  9: [55.0, 82.95],
  10: [56.8431, 60.6454],
  11: [56.85, 60.65],
  12: [55.8304, 49.0661],
  13: [55.84, 49.07],
  14: [56.2965, 43.9361],
  15: [56.3, 43.94],
  16: [55.1644, 61.4368],
  17: [55.17, 61.44],
  18: [53.2001, 50.15],
  19: [53.19, 50.16],
  20: [54.9885, 73.3242],
  21: [54.99, 73.33],
  22: [47.2357, 39.7015],
  23: [47.23, 39.71],
};

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
      } catch (e) { }
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
      center: [58, 50],
      zoom: 4,
      controls: ["zoomControl", "fullscreenControl"],
    });

    loadCities();

    window.addEventListener("resize", () => {
      try {
        map.container.fitToViewport();
      } catch (e) { }
    });
  });
}

function loadCities() {
  fetch("./data/cities.json")
    .then((response) => response.json())
    .then((data) => {
      data.cities.forEach((city) => {
        const coords = cityCoordinates[city.id];
        if (coords) {
          const marker = new ymaps.Placemark(
            coords,
            {
              balloonContent: `<div><strong>${city.name}</strong></div>`,
            },
            {
              preset: "islands#greenDotIcon",
              iconColor: "#18a763",
            }
          );

          marker.events.add("click", function () {
            selectCity(city);
          });

          map.geoObjects.add(marker);
          cityMarkers.push(marker);
        }
      });
    })
    .catch((error) => {
      console.error("Ошибка загрузки городов:", error);
    });
}

function selectCity(city) {
  selectedCity = city;
  selectedProject = null;

  const selectedCityElement = document.getElementById("selectedCityName")
  const selectedProjectElement = document.getElementById("selectedProjectName")

  if (selectedCityElement && selectedProjectElement) {
    selectedCityElement.textContent = city.name;
    selectedProjectElement.textContent =
      "Не выбран";
  }

  const coords = cityCoordinates[city.id];
  if (coords) {
    map.setCenter(coords, 10);
  }

  loadProjectsForCity(city.id);
}

function loadProjectsForCity(cityId) {
  projectMarkers.forEach((marker) => {
    map.geoObjects.remove(marker);
  });
  projectMarkers = [];

  fetch("./data/projects.json")
    .then((response) => response.json())
    .then((data) => {
      const cityProjects = data.projects[cityId];
      if (cityProjects) {
        cityProjects.forEach((project) => {
          const coords = projectCoordinates[project.id];
          if (coords) {
            const marker = new ymaps.Placemark(
              coords,
              {
                balloonContent: `<div><strong>${project.name}</strong></div>`,
              },
              {
                preset: "islands#blueDotIcon",
                iconColor: "#48c5df",
              }
            );

            marker.events.add("click", function () {
              selectProject(project);
            });

            map.geoObjects.add(marker);
            projectMarkers.push(marker);
          }
        });
      }
    })
    .catch((error) => {
      console.error("Ошибка загрузки проектов:", error);
    });
}

function selectProject(project) {
  selectedProject = project;
  (document.getElementById("selectedProjectName") as HTMLSpanElement).textContent =
    project.name;
}

function loadProjectsForSelect(cityId: string | number, callback: Function) {
  fetch("./data/projects.json")
    .then((response) => response.json())
    .then((data) => {
      const projectSelect = document.getElementById("projectSelect") as HTMLOptionElement;
      projectSelect.innerHTML =
        '<option value="">Выберите проект</option>';

      const cityProjects = data.projects[cityId];
      if (cityProjects) {
        cityProjects.forEach((project) => {
          const option = document.createElement("option");
          option.value = project.id;
          option.textContent = project.name;
          projectSelect.appendChild(option);
        });
      }

      if (callback) callback();
    })
    .catch((error) => {
      console.error("Ошибка загрузки проектов для селекта:", error);
      if (callback) callback();
    });
}

function applyMapSelection() {
  if (!selectedCity || !selectedProject) {
    showAlert("Пожалуйста, выберите город и проект на карте");
    return;
  }

  const citySelect = document.getElementById("citySelect");
  const projectSelect = document.getElementById("projectSelect");

  for (let option of citySelect.options) {
    if (option.textContent === selectedCity.name) {
      citySelect.value = option.value;
      break;
    }
  }

  loadProjectsForSelect(selectedCity.id, () => {
    for (let option of projectSelect.options) {
      if (option.textContent === selectedProject.name) {
        projectSelect.value = option.value;
        break;
      }
    }

    closeMapPopup();

    showSuccessAlert(
      `Выбран город: ${selectedCity.name}, проект: ${selectedProject.name}`
    );
  });
}

window.openMapPopup = openMapPopup;

let dropdownData = null;

function loadDropdownData() {
  fetch("./data/dropdown-options.json")
    .then((response) => response.json())
    .then((data) => {
      dropdownData = data;
      populateRequestTypes();
    })
    .catch((error) => {
      console.error("Ошибка загрузки данных dropdown:", error);
    });
}

function populateRequestTypes() {
  const select = document.getElementById("requestTypeSelect") as HTMLSelectElement;
  select.innerHTML = "";

  dropdownData.requestTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.name;
    select.appendChild(option);
  });
}

function handleRequestTypeChange() {
  const requestTypeSelect = document.getElementById("requestTypeSelect") as HTMLSelectElement;
  const categoryBlock = document.getElementById("categoryBlock") as HTMLDivElement;
  const issueBlock = document.getElementById("issueBlock") as HTMLDivElement;

  if (requestTypeSelect.value === "remark") {
    categoryBlock.style.display = "block";
    issueBlock.style.display = "block";
    populateCategories();
  } else {
    categoryBlock.style.display = "none";
    issueBlock.style.display = "none";
    document.getElementById("categorySelect")!.value = "";
    document.getElementById("issueSelect")!.value = "";
  }
}

function populateCategories() {
  const select = document.getElementById("categorySelect") as HTMLSelectElement;
  select.innerHTML = '<option value="">Выберите категорию</option>';

  dropdownData.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

function handleCategoryChange() {
  const categorySelect = document.getElementById("categorySelect") as HTMLSelectElement;
  const issueSelect = document.getElementById("issueSelect") as HTMLSelectElement;

  if (categorySelect.value) {
    populateIssues(categorySelect.value);
  } else {
    issueSelect.innerHTML =
      '<option value="">Сначала выберите категорию</option>';
  }
}

function populateIssues(categoryId: number | string) {
  const select = document.getElementById("issueSelect") as HTMLSelectElement;
  select.innerHTML = '<option value="">Выберите проблему</option>';

  const issues = dropdownData.issues[categoryId];

  issues?.forEach((issue) => {
    const option = document.createElement("option");
    option.value = issue.id;
    option.textContent = issue.name;
    select.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadDropdownData();

  const requestTypeSelect = document.getElementById("requestTypeSelect");
  const categorySelect = document.getElementById("categorySelect");

  if (requestTypeSelect) {
    requestTypeSelect.addEventListener("change", handleRequestTypeChange);
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", handleCategoryChange);
  }
});