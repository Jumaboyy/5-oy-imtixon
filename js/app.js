import { checkAuth } from "./check-auth.js";
import { deleteElementLocal, editElementLocal } from "./crud.js";
import { changeLocalData, localData } from "./local-data.js";
import { addElement, deleteElement, editedElement, getAll } from "./request.js";
import { createToast, deleteToast } from "./toast.js";
import { pagination, ui } from "./ui.js";

let backendDataCache = null;
let workerThread = new Worker("./worker.js");
let editedItemId = null;
let deleteItemId = null;
let currentFilterKey = null;
let currentFilterValue = null;

const elOfflineBanner = document.getElementById("networkError");
const elSearchField = document.getElementById("searchInput");
const elLoader = document.getElementById("loader");
const elItemsContainer = document.getElementById("carContainer");
const elAddBtn = document.getElementById("addButton");
const elFilterType = document.getElementById("filterTypeSelect");
const elFilterValue = document.getElementById("filterValueSelect");
const elPaginationWrapper = document.getElementById("pagination");
const elNoDataBlock = document.getElementById("noData");
const elNoDataText = document.getElementById("noDataInfo");
const elModal = document.getElementById("editModal");
const elAnswerModal = document.getElementById("answerModal");
const elEditForm = document.getElementById("editForm");

let limit = 12;
let skip = 0;

// Event Listeners 

window.addEventListener("DOMContentLoaded", () => {
    if (!navigator.onLine) {
        elOfflineBanner.classList.remove("hidden");
        elOfflineBanner.classList.add("flex");
    } else {
        elOfflineBanner.classList.add("hidden");
        elOfflineBanner.classList.remove("flex");
    }

    elLoader.classList.remove("hidden");
    elLoader.classList.add("grid");

    getAll().then((res) => {
        backendDataCache = res;
    }).catch(console.log);

    createToast("loading", "Ma'lumotlar kutilmoqda");

    getAll(`?limit=${limit}&skip=${skip}`).then((res) => {
        pagination(res.total, res.limit, res.skip);
        changeLocalData(res.data);
        createToast("true", "muvaffaqiyatli keldi");
    }).catch((err) => {
        elNoDataBlock.classList.remove("hidden");
        elNoDataBlock.classList.add("no-data");
        elNoDataText.innerText = "Ma'lumotlar mavjud emas";
        elPaginationWrapper.classList.add("hidden");
        createToast("error", "Ma'lumotlarni olishda xatolik bo'ldi!");
    }).finally(() => {
        elLoader.classList.add("hidden");
        elLoader.classList.remove("grid");
    });
});

// Filter by type
elFilterType.addEventListener("change", (evt) => {
    const value = evt.target.value;
    currentFilterKey = value;

    workerThread.postMessage({
        functionName: "filterByType",
        params: [backendDataCache.data, value],
    });
});

// Filter by value
elFilterValue.addEventListener("change", (evt) => {
    const val = evt.target.value;
    currentFilterValue = val;
    elItemsContainer.innerHTML = "";

    if (currentFilterKey && currentFilterValue) {
        elLoader.classList.remove("hidden");
        elLoader.classList.add("grid");

        getAll(`?${currentFilterKey}=${currentFilterValue}`).then((res) => {
            ui(res.data);
        }).catch((err) => alert(err.message))
        .finally(() => {
            elLoader.classList.add("hidden");
            elLoader.classList.remove("grid");
        });
    }
});

// Search input
elSearchField.addEventListener("input", (evt) => {
    const key = evt.target.value;
    workerThread.postMessage({
        functionName: "search",
        params: [backendDataCache.data, key],
    });
});

// Worker listener
workerThread.addEventListener("message", (evt) => {
    const data = evt.data;
    if (data.target === "filterByType") {
        elFilterValue.innerHTML = "";
        const option = document.createElement("option");
        option.selected = true;
        option.disabled = true;
        option.textContent = "Hammasi";
        elFilterValue.appendChild(option);

        data.result.forEach((el) => {
            const opt = document.createElement("option");
            opt.textContent = el;
            opt.value = el;
            elFilterValue.appendChild(opt);
        });
    } else if (data.target === "search") {
        elItemsContainer.innerHTML = "";
        if (data.result.length > 0) {
            elNoDataBlock.classList.add("hidden");
            elNoDataBlock.classList.remove("no-data");
            elPaginationWrapper.classList.remove("hidden");
            elNoDataText.innerText = "";
            ui(data.result);
        } else {
            elNoDataBlock.classList.remove("hidden");
            elNoDataBlock.classList.add("no-data");
            elPaginationWrapper.classList.add("hidden");
            elNoDataText.innerText = "Bunday mashina mavjud emas";
        }
    }
});

// Online/offline
window.addEventListener("online", () => {
    elOfflineBanner.classList.add("hidden");
    elOfflineBanner.classList.remove("flex");
});

window.addEventListener("offline", () => {
    elOfflineBanner.classList.remove("hidden");
    elOfflineBanner.classList.add("flex");
});

// Delete car
elItemsContainer.addEventListener("click", (evt) => {
    const target = evt.target;
    if (target.classList.contains("js-delete")) {
        if (checkAuth()) {
            elItemsContainer.classList.add("hidden");
            elPaginationWrapper.classList.add("hidden");
            elItemsContainer.classList.remove("grid");
            elAnswerModal.classList.remove("hidden");
            elAnswerModal.classList.add("answer-modal");
            deleteItemId = target.id;
        } else {
            createToast("error", "Ro'yhatdan o'tishingiz kerak!");
            setTimeout(() => window.location.href = "/pages/register.html", 2000);
        }
    }
});

// Answer modal
elAnswerModal.addEventListener("click", (evt) => {
    const target = evt.target;
    if (target.classList.contains("js-xa")) {
        elItemsContainer.classList.remove("hidden");
        elPaginationWrapper.classList.remove("hidden");
        elItemsContainer.classList.add("grid");
        elAnswerModal.classList.add("hidden");
        elAnswerModal.classList.remove("answer-modal");

        createToast("loading", "Ma'lumot o'chirilmoqda");
        deleteElement(deleteItemId).then((id) => {
            deleteToast();
            deleteElementLocal(id);
            createToast("true", "Ma'lumot muvaffaqiyatli o'chirildi");
        }).catch((err) => createToast("error", err.message))
        .finally(() => deleteItemId = null);
    } else if (target.classList.contains("js-yoq")) {
        elItemsContainer.classList.remove("hidden");
        elPaginationWrapper.classList.remove("hidden");
        elItemsContainer.classList.add("grid");
        elAnswerModal.classList.add("hidden");
        elAnswerModal.classList.remove("answer-modal");
        deleteItemId = null;
    }
});

// Add modal
elAddBtn.addEventListener("click", () => {
    if (checkAuth()) {
        elModal.showModal();
    } else {
        createToast("error", "Ro'yhatdan o'tishingiz kerak!");
        setTimeout(() => window.location.href = "/pages/register.html", 2000);
    }
});

// Edit form
document.addEventListener("DOMContentLoaded", () => {
    elEditForm.addEventListener("submit", (e) => {
        e.preventDefault();
        elModal.close();

        const fd = new FormData(elEditForm);
        const generalValues = {};
        const fuelConsumption = {};
        const errors = [];

        const fuelFields = ["city", "highway", "combined"];
        const numberFields = { year: { min: 1700, max: 2025 }, doorCount: { min: 1, max: 20 }, seatCount: { min: 1, max: 20 }, horsepower: { min: 1 } };

        for (let [name, value] of fd.entries()) {
            value = value.trim();
            if (value === "" || value.toLowerCase() === "undefined" || value.toLowerCase() === "null") {
                errors.push(`${name} kiritilmagan yoki noto'g'ri`);
                continue;
            }
            if (fuelFields.includes(name)) {
                fuelConsumption[name] = value;
                continue;
            }
            if (numberFields[name]) {
                const num = Number(value);
                if (!Number.isFinite(num)) { errors.push(`${name} raqam bo'lishi kerak`); continue; }
                if (numberFields[name].min !== undefined && num < numberFields[name].min) { errors.push(`${name} minimal ${numberFields[name].min}`); continue; }
                if (numberFields[name].max !== undefined && num > numberFields[name].max) { errors.push(`${name} maksimal ${numberFields[name].max}`); continue; }
                generalValues[name] = num;
                continue;
            }
            generalValues[name] = value;
        }

        if (errors.length) createToast("error", `${errors}`);

        generalValues.fuelConsumption = fuelConsumption;

        createToast("loading", "Qo'shilmoqda");
        addElement(generalValues).then(res => res.json())
        .finally(() => createToast("true", "Mashina oxirgi sahifaga qo'shildi"));

        elEditForm.reset();
    });
});

// Pagination click
elPaginationWrapper.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("js-page")) {
        skip = evt.target.dataset.skip;
        elItemsContainer.innerHTML = "";
        elLoader.classList.remove("hidden");
        elLoader.classList.add("grid");

        getAll(`?limit=${limit}&skip=${skip}`).then((res) => {
            ui(res.data);
            pagination(res.total, res.limit, res.skip);
        }).catch((err) => alert(err.message))
        .finally(() => {
            elLoader.classList.add("hidden");
            elLoader.classList.remove("grid");
        });
    }
});