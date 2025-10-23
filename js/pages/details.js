const elTitle = document.getElementById("name");
const elDescription = document.getElementById("description");

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
