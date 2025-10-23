export function ui(list) {
    const containerEl = document.getElementById("carContainer");
    containerEl.innerHTML = "";

    list.forEach(item => {
        const cloneNode = document.getElementById("cardTemplate")
            .cloneNode(true).content;

        const titleEl = cloneNode.querySelector(".name");
        const yearEl = cloneNode.querySelector(".year");
        const colorEl = cloneNode.querySelector(".color");
        const maxSpeedEl = cloneNode.querySelector(".maxSpeed");
        const hpEl = cloneNode.querySelector(".horsepower");
        const fuelTypeEl = cloneNode.querySelector(".fuelType");
        const descEl = cloneNode.querySelector(".description");

        const delBtn = cloneNode.querySelector(".js-delete");
        const infoBtn = cloneNode.querySelector(".js-info");

        const trimmedName = item.name?.trim() || "";
        titleEl.innerText = trimmedName.length === 0 ? "no-data" : trimmedName;

        // Year
        try {
            const y = Number(item.year);
            yearEl.innerText = (!isNaN(y) && y > 1700 && y < 2025) ? y : "no-data";
        } catch { yearEl.innerText = "no-data"; }

        // Color
        const clr = item.color;
        if (clr && clr.startsWith("#")) {
            colorEl.style.background = clr;
            colorEl.innerText = "";
        } else {
            colorEl.classList.remove("color");
            colorEl.innerText = "no-data";
        }

        // Max Speed
        const speed = item.maxSpeed?.trim() || "";
        maxSpeedEl.innerText = (speed.length > 0 && speed.endsWith("km/h")) ? speed : "no-data";

        // Horsepower
        try {
            let hp = item.horsepower;
            if (!hp || hp.length === 0 || Number(hp) <= 0) {
                hpEl.innerText = "no-data";
            } else hpEl.innerText = hp;
        } catch { hpEl.innerText = "no-data"; }

        // Fuel Type
        const fType = item.fuelType?.trim() || "";
        fuelTypeEl.innerText = fType.length === 0 ? "no-data" : fType;

        // Description
        descEl.innerText = (!item.description || item.description.trim() === "") ? "no-data" : item.description;

        // Buttons
        delBtn.id = item.id;
        infoBtn.href = `/pages/details.html?id=${item.id}`;

        containerEl.appendChild(cloneNode);
    });
}

export function pagination(total, limit, skip) {
    const elPag = document.getElementById("pagination");
    elPag.innerHTML = "";

    const remainder = total % limit;
    const pages = (total - remainder) / limit;
    const current = (skip / limit) + 1;

    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement("button");
        btn.classList.add("join-item", "btn", "js-page");
        if (current === i) btn.classList.add("btn-active");
        btn.innerText = i;
        btn.dataset.limit = limit;
        btn.dataset.skip = i > 1 ? (i - 1) * limit : 0;
        elPag.appendChild(btn);
    }

    if (remainder > 0) {
        const lastBtn = document.createElement("button");
        lastBtn.classList.add("join-item", "btn", "js-page");
        lastBtn.innerText = pages + 1;
        if (current === pages + 1) lastBtn.classList.add("btn-active");
        lastBtn.dataset.skip = pages * limit;
        elPag.appendChild(lastBtn);
    }
}
