import { changeLocaleData, localData } from "./local-data.js";

export function deleteElementLocal(id) {
  const result = localData.filter((el) => el.id != id);
  changeLocaleData(result);
}

export function addElementLocal(newData) {
  const result = [newData, ...localData];
  changeLocaleData(result);
}

export function editElementLocal(editedData) {
  const result = localData.map((el) => {
    if (el.id === editedData.id) {
      return editedData;
    } else {
      return el;
    }
  });
  changeLocaleData(result);
}
