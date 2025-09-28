export default class DragAndDropManager {
  private dragDropArea: HTMLElement;
  private dragDropContent: HTMLElement;
  public fileInput: HTMLInputElement;
  private fileList: HTMLElement;
  public selectedFiles: File[] = [];

  constructor() {
    this.dragDropArea = document.getElementById("dragDropArea") as HTMLElement;
    this.dragDropContent = this.dragDropArea.querySelector(
      ".drag-drop-content",
    ) as HTMLElement;

    this.fileInput = document.getElementById("fileInput") as HTMLInputElement;
    this.fileList = document.getElementById("fileList") as HTMLElement;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
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
      "image/webp",
    ];

    const invalidFiles: string[] = [];

    files.forEach((file) => {
      const isValidImageType = allowedImageTypes.includes(
        file.type.toLowerCase(),
      );
      const fileExtension = file.name.toLowerCase().split(".").pop();
      const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

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

    if (invalidFiles.length) {
      const message = `Неподдерживаемый формат файлов: ${invalidFiles.join(
        ", ",
      )}. Пожалуйста, загружайте только изображения (JPG, PNG, WebP).`;
      // this.showAlert(message);
    }

    this.updateFileList();
  }

  private updateFileList(): void {
    this.fileList.innerHTML = "";

    this.dragDropContent.style.display = this.selectedFiles.length
      ? "none"
      : "block";

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
}
