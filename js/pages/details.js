import { checkAuth } from "../check-auth.js";
import { editElementLocal } from "../crud.js";
import { editedElement } from "../request.js";
import { createToast } from "../toast.js";

const titleEl = document.getElementById("name");
const trimEl = document.getElementById("trim");
const genEl = document.getElementById("generation");
const yearEl = document.getElementById("year");
const colorBox = document.getElementById("color");
const colorNameEl = document.getElementById("colorName");
const catEl = document.getElementById("category");
const doorEl = document.getElementById("doorCount");
const seatEl = document.getElementById("seatCount");
const maxSpeedEl = document.getElementById("maxSpeed");
const accelEl = document.getElementById("acceleration");
const engineEl = document.getElementById("engine");
const hpEl = document.getElementById("horsepower");
const fuelTypeEl = document.getElementById("fuelType");
const cityEl = document.getElementById("city");
const highwayEl = document.getElementById("highway");
const combEl = document.getElementById("combined");
const countryEl = document.getElementById("country");
const descEl = document.getElementById("description");
const idEl = document.getElementById("id");
const skeletonEl = document.getElementById("skeletoon");
const mainDetEl = document.getElementById("asldet");
const editBtn = document.getElementById("editButton");
const modalEl = document.getElementById("editModal");
const formEl = document.getElementById("editForm");

let currentData = null;
let editedId = null;
let queryId = null;

async function fetchById(id) {
    queryId = id;
    document.title = "Yuklanmoqda...";
    try {
        const r = await fetch(`https://json-api.uz/api/project/fn44/cars/${id}`);
        return await r.json();
    } catch {
        throw new Error("Ma'lumotni olishda xatolik bo'ldi");
    }
}

function setElValue(el, val) {
    if (val === undefined || val === null || String(val).trim() === "") {
        el.innerText = "no-data";
        return;
    }
    if (el.dataset.type === "number" && isNaN(Number(val))) {
        el.innerText = "no-data";
        return;
    }
    el.innerText = val;
}

function renderUI(data) {
    currentData = data;
    document.title = data.name;

    setElValue(titleEl, data.name);
    setElValue(trimEl, data.trim);
    setElValue(genEl, data.generation);
    setElValue(yearEl, data.year);
    setElValue(colorNameEl, data.colorName);
    setElValue(catEl, data.category);
    setElValue(doorEl, data.doorCount);
    setElValue(seatEl, data.seatCount);
    setElValue(maxSpeedEl, data.maxSpeed);
    setElValue(accelEl, data.acceleration);
    setElValue(engineEl, data.engine);
    setElValue(hpEl, data.horsepower);
    setElValue(fuelTypeEl, data.fuelType);
    setElValue(countryEl, data.country);
    setElValue(idEl, queryId);
    setElValue(descEl, data.description);

    setElValue(cityEl, data?.fuelConsumption?.city);
    setElValue(highwayEl, data?.fuelConsumption?.highway);
    setElValue(combEl, data?.fuelConsumption?.combined);

    if (data.color?.startsWith("#")) {
        colorBox.style.background = data.color;
    } else {
        colorBox.style.borderRadius = "1px";
        colorBox.style.width = "56px";
        colorBox.innerText = "no-data";
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    fetchById(id)
    .then(res => renderUI(res))
    .catch(() => {})
    .finally(() => {
        skeletonEl.classList.add("hidden");
        mainDetEl.classList.remove("hidden");
    });
});

editBtn.addEventListener("click", () => {
    if (!checkAuth()) {
        createToast("error", "Ro'yhatdan o'tishingiz kerak!");
        setTimeout(() => { window.location.href = "/pages/register.html"; }, 2000);
        return;
    }

    const d = currentData;
    formEl.name.value = d.name;
    formEl.description.value = d.description;
    formEl.trim.value = d.trim;
    formEl.generation.value = d.generation;
    formEl.year.value = d.year;
    formEl.color.value = d.color;
    formEl.colorName.value = d.colorName;
    formEl.category.value = d.category;
    formEl.doorCount.value = d.doorCount;
    formEl.seatCount.value = d.seatCount;
    formEl.maxSpeed.value = d.maxSpeed;
    formEl.acceleration.value = d.acceleration;
    formEl.engine.value = d.engine;
    formEl.horsepower.value = d.horsepower;
    formEl.fuelType.value = d.fuelType;
    formEl.country.value = d.country;
    const { city, highway, combined } = d.fuelConsumption;
    formEl.city.value = city;
    formEl.highway.value = highway;
    formEl.combined.value = combined;

    modalEl.showModal();
});

formEl.addEventListener("submit", function(e) {
    e.preventDefault();

    const fd = new FormData(formEl);
    const genValues = {};
    const fuelVals = {};
    const errs = [];
    const fuelKeys = ["city","highway","combined"];
    const numFields = { year:{min:1700,max:2025}, doorCount:{min:1,max:20}, seatCount:{min:1,max:20}, horsepower:{min:1} };

    for (let [k,v] of fd.entries()) {
        v = v.trim();
        if (v === "" || v.toLowerCase() === "undefined" || v.toLowerCase() === "null") {
            errs.push(`${k} kiritilmagan yoki noto'g'ri`);
            continue;
        }
        if (fuelKeys.includes(k)) { fuelVals[k] = v; continue; }
        if (numFields[k]) {
            const n = Number(v);
            if (!Number.isFinite(n)) { errs.push(`${k} raqam bo'lishi kerak`); continue; }
            if (numFields[k].min !== undefined && n < numFields[k].min) { errs.push(`${k} minimal ${numFields[k].min}`); continue; }
            if (numFields[k].max !== undefined && n > numFields[k].max) { errs.push(`${k} maksimal ${numFields[k].max}`); continue; }
            genValues[k] = n;
            continue;
        }
        genValues[k] = v;
    }

    if (errs.length) {
        console.log(errs);
    } else {
        modalEl.close();
    }

    genValues.fuelConsumption = fuelVals;
    editedId = queryId;

    if (editedId) {
        genValues.id = editedId;
        createToast("loading", "Tahrirlanmoqda...");
        editedElement(genValues)
        .then(res => {
            location.reload();
            editElementLocal(res);
        })
        .catch(() => {})
        .finally(() => {
            editedId = null;
            modalEl.close();
            createToast("true", "Ma'lumot muvaffaqiyatli tahrirlandi");
        });
    }

    // form reset
    for (let el of formEl.elements) { if ("value" in el) el.value = ""; }
});