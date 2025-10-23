const elTitle = document.getElementById("name");
const elDescription = document.getElementById("description");
const elCountry = document.getElementById("country");
const elCategory = document.getElementById("category");
const elYear = document.getElementById("year");
const elColorName = document.getElementById("colorName");
const elMaxSpeed = document.getElementById("maxSpeed");
const elTrim = document.getElementById("trim");
const elEngage = document.getElementById("engine");
const elGeneration = document.getElementById("generation");
const elDoorCount = document.getElementById("doorCount");
const elSeatCount = document.getElementById("seatCount");
const elHorsePower = document.getElementById("horsepower");
const elFuelType = document.getElementById("fuelType");
const elAcceleration = document.getElementById("acceleration");

async function getByID(id) {
  document.title = "Yuklanmoqda...";
  try {
    const req = await fetch(`https://json-api.uz/api/project/fn44/cars/${id}`);
    const res = await req.json();
    return res;
  } catch {
    throw new Error("Ma'lumotni olishda xatolik bo'ldi!");
  }
}

function ui(data) {
  document.title = data.name;
  elTitle.innerText = data.name;
  elDescription.innerText = data.description;
  elCategory.innerHTML = `<strong>Turkum:</strong> ${data.category}`;
  elCountry.innerHTML = `<strong>Davlat:</strong> ${data.country}`;
  elYear.innerHTML = `<strong>Yili:</strong> ${data.year}`;
  elMaxSpeed.innerHTML = `<strong>Max Tezligi:</strong> ${data.maxSpeed}`;
  elColorName.innerHTML = `<strong>Rang: </strong> ${data.colorName}`;
  elTrim.innerHTML = `<strong>Trim: </strong> ${data.trim}`;
  elEngage.innerHTML = `<strong>engine: </strong> ${data.engine}`;
  elGeneration.innerHTML = `<strong>Generation: </strong> ${data.generation}`;
  elHorsePower.innerHTML = `<strong>Ot kuchi: </strong> ${data.horsepower}`;
  elSeatCount.innerHTML = `<strong>O'rindiqlar soni: </strong> ${data.seatCount}`;
  elDoorCount.innerHTML = `<strong>eshiklar soni: </strong> ${data.doorCount}`;
  elFuelType.innerHTML = `<strong>Yoqilg'i: </strong> ${data.fuelType}`;
  elAcceleration.innerHTML = `<strong>tezlanishi: </strong> ${data.acceleration}`;
}

window.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(location.search).get("id");
  getByID(id)
    .then((res) => {
      ui(res);
    })
    .catch(() => {
      console.log("salom");
    })
    .finally(() => {});
});
