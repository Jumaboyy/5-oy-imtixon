import { ui } from "./ui.js";

export let localData = null;

export function changeLocaleData(value) {
  localData = value;
  ui(localData);
}
