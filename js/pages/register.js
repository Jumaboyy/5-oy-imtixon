import { createToast } from "../toast.js";

const elForm = document.getElementById("form");

async function register(user) {
    try {
        const req = await fetch("https://json-api.uz/api/project/fn44/auth/register", {
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
    console.log(result);
    

    createToast("loading", "Ma'lumotlaringiz yuborildi")
    register(result)
    .then(() => {
        createToast("true", "Hisobga muvaffaqiyatli kirildi!")
        setTimeout(() => {
            window.location.href = "../../pages/login.html"
        }, 2000)
    })
    .catch((error) => {
        console.log(error.message);
        createToast("error", "Ro'yhatdan o'tish xato")
    })
    .finally(() => {
    });
})