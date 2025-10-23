export function ui(data) {
  const elContainer = document.getElementById("container");
  elContainer.innerHTML = "";
  data.forEach((el) => {
    const clone = document
      .getElementById("cardTemplate")
      .cloneNode(true).content;

    const elTitle = clone.querySelector("h2");
    const elDescription = clone.querySelector("p");
    const elInfoBtn = clone.querySelector(".js-info");
    const elEditBtn = clone.querySelector(".js-edit");
    const elDeleteBtn = clone.querySelector(".js-delete");

    elDeleteBtn.id = el.id;
    elEditBtn.id = el.id;
    elInfoBtn.href = `/pages/details.html?id=${el.id}`;

    elTitle.innerText = el.name;
    elDescription.innerText = el.description;

    elContainer.appendChild(clone);
  });
}

export function pagination(total, limit, skip) {
  const elPagination = document.getElementById("pagination");
  elPagination.innerHTML = "";
  const remained = total % limit;
  const pageCount = (total - remained) / limit;
  let activePage = skip / limit + 1;

  for (let i = 1; i <= pageCount + (remained > 0 ? 1 : 0); i++) {
    const button = document.createElement("button");
    button.classList.add(
      "join-item",
      "btn",
      "js-page",
      activePage === i ? "btn-active" : null
    );

    button.innerText = i;
    button.dataset.skip = limit * i - limit;

    elPagination.appendChild(button);
  }
}
