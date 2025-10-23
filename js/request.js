const baseURL = "https://json-api.uz/api/project/fn44"

export async function getAll(query = "") {
    try {
        const req = await fetch(baseURL + `/cars${query ? query : ""}`)
        const res = await req.json()
        return res
    } catch {
        throw new Error("Ma'lumotlarni olishda xatolik bo'ldi")
    }
}

export async function addElement(newData) {
    try {
        const token = localStorage.getItem("token")
        const req = await fetch(baseURL + "/cars", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newData),
        })
        const res = await req.json()
        return res
    } catch {
        throw new Error("Ma'lumotni qo'shishda xatolik bo'ldi")
    }
}

export async function editedElement(editedData) {
    try {
        const token = localStorage.getItem("token")
        const req = await fetch(baseURL + `/cars/${editedData.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editedData),
        })
        const res = await req.json()
        return res
    } catch {
        throw new Error("Ma'lumotni tahrirlashda xatolik bo'ldi")
    }
}

export async function deleteElement(id) {
    try {
        const token = localStorage.getItem("token")
        await fetch(baseURL + `/cars/${id}`,{
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return id
    } catch {
        throw new Error("Ma'lumotni o'chirishda xatolik bo'ldi")
    }
}