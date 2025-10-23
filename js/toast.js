const toastWrapper = document.getElementById("toastContainer");

export function createToast(type, text) {
    toastWrapper.innerHTML = "";
    
    const messageEl = document.createElement("p");
    const toastItem = document.createElement("li");

    messageEl.textContent = text;
    toastItem.classList.add("toastli");

    if (type === "true") {
        toastItem.classList.add("toast-true");
        toastItem.appendChild(messageEl);
    } else if (type === "toast-error") {
        toastItem.classList.add("error");
        toastItem.appendChild(messageEl);
    } else if (type === "loading") {
        toastItem.classList.add("loadingToast");
        toastItem.appendChild(messageEl);
    }

    toastWrapper.appendChild(toastItem);

    setTimeout(() => {
        if (toastItem.parentNode) {
            toastItem.parentNode.removeChild(toastItem);
        }
    }, 4000);
}

export function deleteToast() {
    toastWrapper.innerHTML = "";
}
