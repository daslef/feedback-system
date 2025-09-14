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

// Типы для Яндекс.Карт
declare const ymaps: any;

let map: any;
let selectedCity: any = null;
let selectedProject: any = null;
let cityMarkers: any[] = [];
let projectMarkers: any[] = [];

const cityCoordinates = {
  // Координаты для городов из API (примерные координаты для Ленинградской области)
  56: [59.378053, 28.601209], // Кингисеппский МР
  57: [59.56841, 30.122892],  // Гатчинский МР
  58: [60.021321, 30.654084], // Всеволожский МР
  59: [59.473576, 33.847675], // Бокситогорский МР
  60: [59.449695, 32.008716], // Киришский МР
  61: [59.87533, 30.981457],  // Кировский МР
  62: [59.447275, 29.484819], // Волосовский МР
  63: [59.77409, 30.794553],  // Ломоносовский МР
  64: [59.900543, 32.352681], // Волховский МР
  65: [58.735207, 29.847945], // Лужский МР
  66: [60.912097, 34.167952], // Подпорожский МР
  67: [61.035979, 30.115589], // Приозерский МР
  68: [59.11779, 28.088145],  // Сланцевский МР
  69: [59.541179, 30.875006], // Тосненский МР
  70: [60.710496, 28.749781], // Выборгский МР
  71: [59.644213, 33.542105], // Тихвинский МР
  72: [59.904225, 29.09221],  // Сосновоборский городской округ
  73: [60.734305, 33.543183], // Лодейнопольский МР
  // Города
  75: [59.473576, 33.847675], // Бокситогорск
  77: [59.447275, 29.484819], // Волосово
  78: [59.900543, 32.352681], // Волхов
  79: [60.021321, 30.654084], // Всеволожск
  80: [60.710496, 28.749781], // Выборг
  82: [59.56841, 30.122892],  // Гатчина
  83: [59.37649, 28.219712],  // Ивангород
  85: [59.378053, 28.601209], // Кингисепп
  86: [59.449695, 32.008716], // Кириши
  87: [59.87533, 30.981457],  // Кировск
  92: [58.735207, 29.847945], // Луга
  93: [59.349301, 31.24858],  // Любань
  95: [59.704642, 30.788975], // Никольское
  96: [60.106401, 32.316183], // Новая Ладога
  97: [59.77409, 30.794553],  // Отрадное
  98: [59.512684, 34.177483], // Пикалёво
  99: [60.912097, 34.167952], // Подпорожье
  100: [60.366014, 28.613561], // Приморск
  101: [61.035979, 30.115589], // Приозерск
  102: [61.113731, 28.865879], // Светогорск
  103: [60.143531, 30.217179], // Сертолово
  104: [59.11779, 28.088145],  // Сланцы
  105: [59.904225, 29.09221],  // Сосновый Бор
  108: [59.644213, 33.542105], // Тихвин
  109: [59.541179, 30.875006], // Тосно
  110: [59.944959, 31.034754], // Шлиссельбург
};

// projectCoordinates больше не используется, так как координаты берутся из API

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
      } catch {}
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
      } catch {
        // Игнорируем ошибки при изменении размера
      }
    });
  });
}

async function loadCities() {
  try {
    const response = await fetch("http://localhost:3000/api/administrative_units");
    const cities = await response.json();
    
    cities.forEach((city: any) => {
      // Используем координаты из статических данных для городов
      // В реальном проекте координаты должны быть в API
      const coords = cityCoordinates[city.id as keyof typeof cityCoordinates];
      if (coords) {
        const marker = new ymaps.Placemark(
          coords,
          {
            balloonContent: `<div><strong>${city.title}</strong></div>`,
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

function selectCity(city: any) {
  selectedCity = city;
  selectedProject = null;

  const selectedCityElement = document.getElementById("selectedCityName");
  const selectedProjectElement = document.getElementById("selectedProjectName");

  if (selectedCityElement && selectedProjectElement) {
    selectedCityElement.textContent = city.title;
    selectedProjectElement.textContent = "Не выбран";
  }

  const coords = cityCoordinates[city.id as keyof typeof cityCoordinates];
  if (coords) {
    map.setCenter(coords, 10);
  }

  loadProjectsForCity(city.id);
}

async function loadProjectsForCity(cityId: number) {
  projectMarkers.forEach((marker) => {
    map.geoObjects.remove(marker);
  });
  projectMarkers = [];

  try {
    const response = await fetch("http://localhost:3000/api/projects");
    const projects = await response.json();
    
    const cityProjects = projects.filter((project: any) => 
      project.administrative_unit_id === cityId
    );
    
    if (cityProjects.length > 0) {
      cityProjects.forEach((project: any) => {
        // Используем реальные координаты из API
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

async function loadProjectsForSelect(cityId: string | number, callback: Function) {
  try {
    const response = await fetch("http://localhost:3000/api/projects");
    const projects = await response.json();
    
    const projectSelect = document.getElementById(
      "projectSelect",
    ) as HTMLSelectElement;
    projectSelect.innerHTML = '<option value="">Выберите проект</option>';

    const cityProjects = projects.filter((project: any) => 
      project.administrative_unit_id.toString() === cityId.toString()
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
  const projectSelect = document.getElementById("projectSelect") as HTMLSelectElement;

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
    // Загружаем категории из API
    const response = await fetch("http://localhost:3000/api/topic_categories");
    categories = await response.json();
    
    populateRequestTypes();
  } catch (error) {
    console.error("Ошибка загрузки данных dropdown:", error);
  }
}

function populateRequestTypes() {
  const select = document.getElementById(
    "requestTypeSelect",
  ) as HTMLSelectElement;
  select.innerHTML = "";

  // Статические типы запросов
  const requestTypes = [
    { id: "wish", name: "Отправить пожелание" },
    { id: "remark", name: "Отправить замечание" }
  ];

  requestTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.name;
    select.appendChild(option);
  });
}

function handleRequestTypeChange() {
  const requestTypeSelect = document.getElementById(
    "requestTypeSelect",
  ) as HTMLSelectElement;
  const categoryBlock = document.getElementById(
    "categoryBlock",
  ) as HTMLDivElement;
  const issueBlock = document.getElementById("issueBlock") as HTMLDivElement;

  if (requestTypeSelect.value === "remark") {
    categoryBlock.style.display = "block";
    issueBlock.style.display = "block";
    populateCategories();
  } else {
    categoryBlock.style.display = "none";
    issueBlock.style.display = "none";
    const categorySelect = document.getElementById("categorySelect") as HTMLSelectElement;
    const issueSelect = document.getElementById("issueSelect") as HTMLSelectElement;
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
    const response = await fetch(`http://localhost:3000/api/topic_category_topics?filter_by=category&field_id=${categoryId}`);
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
