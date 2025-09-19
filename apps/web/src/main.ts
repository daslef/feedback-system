import FormManager from "./form-manager";
import MapsManager from "./maps-manager";
import DragAndDropManager from "./dnd-manager";
import AlertManager from "./alert-manager";

import { apiClient } from "./api-client";


document.addEventListener("DOMContentLoaded", function () {
  const alertManager = new AlertManager();
  const dropManager = new DragAndDropManager();
  const formManager = new FormManager({ apiClient, alertManager });
  const mapsManager = new MapsManager({ apiClient, alertManager });

  const selectOnMapButton = document.getElementById(
    "selectOnMap",
  ) as HTMLButtonElement;

  selectOnMapButton.addEventListener("click", () => {
    mapsManager.open({
      selectedTownId: formManager.citySelect.value || null,
      selectedProjectId: formManager.projectSelect.value || null,
    });
  });
});
