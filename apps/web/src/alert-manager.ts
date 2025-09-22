import type { AlertManagerInterface } from "./types";

export default class AlertManager implements AlertManagerInterface {
  private alertCloseButton: HTMLButtonElement;
  private alertElement: HTMLElement;

  constructor() {
    this.alertElement = document.getElementById("customAlert") as HTMLElement;
    this.alertCloseButton = document.querySelector(
      "#customAlert .alert-close",
    ) as HTMLButtonElement;

    this.alertCloseButton.addEventListener("click", () => this.closeAlert());
  }

  public showAlert(message: string, type: "success" | "warning" = "warning") {
    const messageElement = this.alertElement.querySelector(
      ".alert-message",
    ) as HTMLElement;
    const iconElement = this.alertElement.querySelector(
      ".alert-icon",
    ) as HTMLElement;

    messageElement.textContent = message;
    iconElement.textContent = type === "warning" ? "⚠️" : "✅";

    if (type === "warning") {
      this.alertElement.classList.remove("success");
      this.alertElement.classList.add("show");
    } else {
      this.alertElement.classList.add("show", "success");
    }

    setTimeout(() => {
      this.closeAlert();
    }, 4000);
  }

  public closeAlert() {
    this.alertElement?.classList.remove("show", "success");
  }
}
