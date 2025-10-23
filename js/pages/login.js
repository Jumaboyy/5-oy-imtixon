import { getFormData } from "../get-form-data.js";

const elForm = document.getElementById("form");

async function login(user) {
  try {
    const req = await fetch("https://json-api.uz/api/project/fn44/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      method: "POST",
    });
    const res = await req.json();
    return res;
  } catch {
    throw new Error("Ro'yhatdan o'tishda xatolik bo'ldi!");
  }
}

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const result = getFormData(elForm);
  login(result)
    .then((res) => {
      localStorage.setItem("token", res.access_token);
      window.location.href = "../../index.html";
    })
    .catch(() => {})
    .finally(() => {});
});
