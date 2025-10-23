import { createToast } from "../toast.js";

const elForm = document.getElementById("form");

async function login(user) {
    try {
        const req = await fetch("https://json-api.uz/api/project/fn44/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        const res = await req.json()
        return res
    } catch {
        throw new Error("Ro'yhatdan o'tishda xatolik bo'ldi")
    }
}

elForm.addEventListener("submit", (evt) => {
    evt.preventDefault()

    const formData = new FormData(elForm);
    const result = {};

    formData.forEach((value, key) => {
        result[key] = value;
    })

    createToast("loading", "Ma'lumotlaringiz yuborildi")
    login(result)
    .then((res) => {
        createToast("true", "Hisobga muvaffaqiyatli kirildi!")
        setTimeout(() => {
            localStorage.setItem("token", res.access_token)
            window.location.href = "../../index.html"
        }, 2000)
        
    })
    .catch(() => {})
    .finally(() => {});
})