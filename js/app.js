import { checkAuth } from "./check-auth.js";
import { deleteElementLocal, editElementLocal } from "./crud.js";
import { changeLocaleData, localData } from "./localData.js";
import { deleteElement, editElement, getAll } from "./request.js";
import { pagination, ui } from "./ui.js";

const limit = 12;
let skip = 0;

const elEditModal = document.getElementById("editModal");
const elEditedForm = document.getElementById("editForm");
const elContainer = document.getElementById("container");
const elOfflinePage = document.getElementById("offlinePage");
const elFilterTypeSelect = document.getElementById("filterTypeSelect");
const elFilterValueSelect = document.getElementById("filterValueSelect");
const elSearchInput = document.getElementById("searchInput");
const elLoading = document.getElementById("loading");
const elFilterSearch = document.getElementById("filterSearch");
const elPagination = document.getElementById("pagination");

let backendData = null;
let worker = new Worker("./worker.js");
let filterKey = null;
let filterValue = null;
let editedElementId = null;

window.addEventListener("DOMContentLoaded", () => {
  if (window.navigator.onLine === false) {
    elOfflinePage.classList.remove("hidden");
  } else {
    elOfflinePage.classList.add("hidden");
  }

  getAll(`?limit=${limit}&skip=${skip}`)
    .then((res) => {
      elFilterSearch.classList.remove("flex");
      elFilterSearch.classList.add("hidden");
      backendData = res;
      pagination(backendData.total, backendData.limit, backendData.skip);
      changeLocaleData(backendData.data);
    })
    .catch((error) => {
      alert(error.message);
    })
    .finally(() => {
      elLoading.classList.add("hidden");
      elFilterSearch.classList.add("flex");
      elFilterSearch.classList.remove("hidden");
    });
});

window.addEventListener("online", () => {
  elOfflinePage.classList.add("hidden");
  elOfflinePage.classList.remove("z-10");
});

window.addEventListener("offline", () => {
  elOfflinePage.classList.remove("hidden");
  elOfflinePage.classList.add("z-10");
});

elFilterTypeSelect.addEventListener("change", (evt) => {
  const value = evt.target[evt.target.selectedIndex].value;
  filterKey = value;
  worker.postMessage({
    functionName: "fiterByType",
    params: [backendData.data, value],
  });
});

elFilterValueSelect.addEventListener("change", (evt) => {
  const value = evt.target[evt.target.selectedIndex].value;
  filterValue = value;
  const elContainer = document.getElementById("container");
  elContainer.innerHTML = null;
  if (filterValue && filterKey) {
    getAll(`?${filterKey}=${filterValue}`)
      .then((res) => {
        ui(res.data);
      })
      .catch((error) => {
        alert(error.message);
      });
  }
});

elSearchInput.addEventListener("input", (evt) => {
  const key = evt.target.value;
  worker.postMessage({
    functionName: "search",
    params: [backendData.data, key],
  });
});

worker.addEventListener("message", (evt) => {
  // Select
  const response = evt.data;
  if (response.target === "fiterByType") {
    elFilterValueSelect.classList.remove("hidden");
    elFilterValueSelect.innerHTML = "";
    const option = document.createElement("option");
    option.selected = true;
    option.disabled = true;
    option.textContent = "All";
    elFilterValueSelect.appendChild(option);
    response.result.forEach((el) => {
      const option = document.createElement("option");
      option.value = el;
      option.textContent = el;
      elFilterValueSelect.appendChild(option);
    });
  } else if (response.target === "search") {
    const elContainer = document.getElementById("container");
    elContainer.innerHTML = null;

    if (response.result.length > 0) {
      ui(response.result);
    } else {
      alert("No data");
    }
  }
});

// crud

elContainer.addEventListener("click", (evt) => {
  const target = evt.target;

  // Edit

  if (target.classList.contains("js-edit")) {
    if (checkAuth()) {
      editedElementId = target.id;
      elEditModal.showModal();
      const foundElement = localData.find((el) => el.id == target.id);
      elEditedForm.name.value = foundElement.name;
      elEditedForm.description.value = foundElement.description;
    } else {
      window.location.href = "../pages/login.html";
      alert("Ro'yhatdan o'tishingiz kerak");
    }
  }

  // Get

  if (target.classList.contains("js-info")) {
  }

  // Delete

  if (target.classList.contains("js-delete")) {
    if (checkAuth() && confirm("Rostdan o'chirmoqchimisiz")) {
      deleteElement(target.id)
        .then((id) => {
          deleteElementLocal(id);
        })
        .catch(() => {})
        .finally(() => {});
    } else {
      alert("Ro'yhatdan o'tishingiz kerak");
      window.location.href = "../pages/login.html";
    }
  }
});

elEditedForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const formData = new FormData(elEditedForm);
  const result = {};
  formData.forEach((value, key) => {
    result[key] = value;
  });
  if (editedElementId) {
    result.id = editedElementId;
    editElement(result)
      .then((res) => {
        editElementLocal(res);
      })
      .catch(() => {})
      .finally(() => {
        editedElementId = null;
        elEditModal.close();
      });
  }
});

elPagination.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("js-page")) {
    skip = evt.target.dataset.skip;
    getAll(`?limit=${limit}&skip=${skip}`)
      .then((res) => {
        ui(res.data);
        pagination(res.total, res.limit, res.skip);
      })
      .catch((error) => {
        alert(error.message);
      });
  }
});
