import { checkAuth } from "./check-auth.js";
import { deleteElementLocal, editElementLocal } from "./crud.js";
import { getFormData } from "./get-form-data.js";
import { changeLocaleData, localData } from "./local-data.js";
import { deleteElement, editElement, getAll } from "./request.js";
import { pagination, ui } from "./ui.js";

// getAll()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.log(error.message);
//   })
//   .finally(() => {
//     console.log("Ish tugadi!");
//   });

// const elTimer = document.getElementById("timer");
// const elBtn = document.getElementById("f");
// setInterval(() => {
//   const date = new Date();
//   const time = ` ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} `;
//   elTimer.innerHTML = time;
// }, 1000);

// const worker = new Worker("./worker.js");
// console.log(worker);

// elBtn.addEventListener("click", () => {
//   worker.postMessage("test");
// });

// Channel for syn
const channel1 = new BroadcastChannel("channel_1");
channel1.onmessage = (evt) => {
  if (evt.data.action === "redirect") {
    window.location.href = evt.data.address;
  }
  if (evt.data.action === "DELETE") {
    deleteElementLocal(evt.data.address);
  }
  if (evt.data.action === "EDIT") {
    editElementLocal(evt.data.address);
  }
};

const limit = 12;
let skip = 0;

// Internet yo'qligida chiqivchi biror narsa
const elEditModal = document.getElementById("editModal");
const elEditedForm = document.getElementById("editForm");
const elContainer = document.getElementById("container");
const elOfflinePage = document.getElementById("offlinePage");
const elFilterTypeSelect = document.getElementById("filterTypeSelect");
const elFilterValueSelect = document.getElementById("filterValueSelect");
const elSearchInput = document.getElementById("searchInput");
const elPagination = document.getElementById("pagination");
const elCursor = document.getElementById("cursor");

let backendData = null;
let worker = new Worker("./worker.js");
let filterKey = null;
let filterValue = null;
let editedElementId = null;

function warning() {
  window.location.href = "../pages/login.html";
  channel1.postMessage({ action: "redirect", address: "../pages/login.html" });
  alert("Ro'yhatdan o'tishingiz kerak");
}

// online offline
window.addEventListener("online", () => {
  elOfflinePage.classList.add("hidden");
});

window.addEventListener("offline", () => {
  elOfflinePage.classList.remove("hidden");
});

// web worker

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
    elContainer.innerHTML = "";
    if (response.result.length > 0) {
      ui(response.result);
    } else {
      alert("No data");
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  if (window.navigator.onLine === false) {
    elOfflinePage.classList.remove("hidden");
  } else {
    elOfflinePage.classList.add("hidden");
  }
  getAll()
    .then((res) => {
      backendData = res;
    })
    .catch((error) => {
      alert(error.message);
    });
  getAll(`?limit=${limit}&skip=${skip}`)
    .then((res) => {
      pagination(res.total, res.limit, res.skip);
      changeLocaleData(res.data);
    })
    .catch((error) => {
      alert(error.message);
    });
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
      warning();
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
          channel1.postMessage({ action: "DELETE", address: id });
        })
        .catch(() => {})
        .finally(() => {});
    } else {
      warning();
    }
  }
});

elEditedForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const result = getFormData(elEditedForm);
  if (editedElementId) {
    result.id = editedElementId;
    editElement(result)
      .then((res) => {
        editElementLocal(res);
        channel1.postMessage({ action: "EDIT", address: res });
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

// Cursor
document.addEventListener("mousemove", (evt) => {
  const x = evt.clientX;
  const y = evt.clientY;
  console.log(x, y);

  elCursor.style.cssText = `
  top:${y}px;
  left:${x}px;
  `;
});
