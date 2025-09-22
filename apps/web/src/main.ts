import State from "./state";
import FormManager from "./form-manager";
import MapsManager from "./maps-manager";

const state = new State();

document.addEventListener("DOMContentLoaded", async function () {
  await state.init();

  const formManager = new FormManager({ state });
  const mapsManager = new MapsManager({ state });

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
