class FormManager {
  private citySelect: HTMLSelectElement;
  private projectSelect: HTMLSelectElement;
  private dragDropArea: HTMLElement;
  private fileInput: HTMLInputElement;
  private fileList: HTMLElement;
  private form: HTMLFormElement;
  private selectedFiles: File[] = [];

  constructor() {
    this.citySelect = document.getElementById(
      "citySelect",
    ) as HTMLSelectElement;
    this.projectSelect = document.getElementById(
      "projectSelect",
    ) as HTMLSelectElement;
    this.dragDropArea = document.getElementById("dragDropArea") as HTMLElement;
    this.fileInput = document.getElementById("fileInput") as HTMLInputElement;
    this.fileList = document.getElementById("fileList") as HTMLElement;
    this.form = document.querySelector(".apply-form") as HTMLFormElement;

    this.init();
  }

  private async init(): Promise<void> {
    await this.loadCities();
    this.setupEventListeners();
  }

  private async loadCities(): Promise<void> {
    try {
      const response = await fetch("./data/cities.json");
      const data = await response.json();

      this.citySelect.innerHTML = '<option value="">Выберите город</option>';
      data.cities.forEach((city: any) => {
        const option = document.createElement("option");
        option.value = city.id;
        option.textContent = city.name;
        this.citySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Ошибка загрузки городов:", error);
    }
  }

  private async loadProjects(cityId: string): Promise<void> {
    try {
      const response = await fetch("./data/projects.json");
      const data = await response.json();

      this.projectSelect.innerHTML =
        '<option value="">Выберите проект</option>';

      if (data.projects[cityId]) {
        data.projects[cityId].forEach((project: any) => {
          const option = document.createElement("option");
          option.value = project.id;
          option.textContent = project.name;
          this.projectSelect.appendChild(option);
        });
      } else {
        this.projectSelect.innerHTML =
          '<option value="">Проекты не найдены</option>';
      }
    } catch (error) {
      console.error("Ошибка загрузки проектов:", error);
    }
  }

  private setupEventListeners(): void {
    this.citySelect.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      if (target.value) {
        this.loadProjects(target.value);
      } else {
        this.projectSelect.innerHTML =
          '<option value="">Сначала выберите город</option>';
      }
    });

    const selectOnMapBtn = document.getElementById("selectOnMap");
    if (selectOnMapBtn) {
      selectOnMapBtn.addEventListener("click", () => {
        const w: any = window as any;
        if (typeof w.openMapPopup === "function") {
          w.openMapPopup();
        } else {
          console.error("Функция openMapPopup не найдена");
          alert("Карта временно недоступна. Попробуйте обновить страницу.");
        }
      });
    }
    this.setupDragAndDrop();

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }

  private setupDragAndDrop(): void {
    this.dragDropArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.dragDropArea.classList.add("dragover");
    });

    this.dragDropArea.addEventListener("dragleave", () => {
      this.dragDropArea.classList.remove("dragover");
    });

    this.dragDropArea.addEventListener("drop", (e) => {
      e.preventDefault();
      this.dragDropArea.classList.remove("dragover");

      const files = Array.from(e.dataTransfer?.files || []);
      this.handleFiles(files);
    });

    this.dragDropArea.addEventListener("click", () => {
      this.fileInput.click();
    });

    this.fileInput.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const files = Array.from(target.files || []);
      this.handleFiles(files);
    });
  }

  private handleFiles(files: File[]): void {
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/tiff",
    ];

    const invalidFiles: string[] = [];

    files.forEach((file) => {
      const isValidImageType = allowedImageTypes.includes(
        file.type.toLowerCase(),
      );
      const fileExtension = file.name.toLowerCase().split(".").pop();
      const allowedExtensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "bmp",
        "tiff",
      ];
      const isValidExtension =
        fileExtension && allowedExtensions.includes(fileExtension);

      if (!isValidImageType && !isValidExtension) {
        invalidFiles.push(file.name);
      } else if (
        !this.selectedFiles.find(
          (f) => f.name === file.name && f.size === file.size,
        )
      ) {
        this.selectedFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      const message = `Неподдерживаемый формат файлов: ${invalidFiles.join(
        ", ",
      )}. Пожалуйста, загружайте только изображения (JPG, PNG, GIF, WebP, BMP, TIFF).`;
      this.showAlert(message);
    }

    this.updateFileList();
  }

  private updateFileList(): void {
    this.fileList.innerHTML = "";

    const dragDropContent = this.dragDropArea.querySelector(
      ".drag-drop-content",
    ) as HTMLElement;

    if (this.selectedFiles.length > 0) {
      if (dragDropContent) {
        dragDropContent.style.display = "none";
      }
    } else {
      if (dragDropContent) {
        dragDropContent.style.display = "block";
      }
    }
    this.selectedFiles.forEach((file, index) => {
      const fileItem = document.createElement("div");
      fileItem.className = "file-item";

      fileItem.innerHTML = `
        <span class="file-name">${file.name}</span>
        <button type="button" class="file-remove" data-index="${index}">×</button>
      `;

      this.fileList.appendChild(fileItem);
    });

    this.fileList.querySelectorAll(".file-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const index = parseInt(target.getAttribute("data-index") || "0");
        this.selectedFiles.splice(index, 1);
        this.updateFileList();
      });
    });
  }

  private showAlert(message: string): void {
    const globalShowAlert = (window as any).showAlert;
    if (typeof globalShowAlert === "function") {
      globalShowAlert(message);
    } else {
      alert(message);
    }
  }

  private handleFormSubmit(): void {
    const formData = new FormData(this.form);

    const formDataObject: any = {};
    for (const [key, value] of formData.entries()) {
      if (key === "personal_data_agreement") {
        formDataObject[key] = true;
      } else {
        formDataObject[key] = value;
      }
    }
    formDataObject.files = this.selectedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    console.log("Данные формы:", formDataObject);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new FormManager();
});
