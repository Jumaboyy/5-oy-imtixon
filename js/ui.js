export function ui(data) {
  const elContainer = document.getElementById("container");
  elContainer.innerHTML = "";
  data.forEach((el) => {
    const clone = document.getElementById("cardTemplate").cloneNode(true).content;

    const elTitle = clone.querySelector("h2");
    const elDescription = clone.querySelector("p");
    const elTrim = clone.querySelector(".card-trim");
    const elYear = clone.querySelector(".card-year");
    const elMaxSpeed = clone.querySelector(".card-maxSpeed");
    const elEngine = clone.querySelector(".card-engine");
    const elHorsePower = clone.querySelector(".card-horsepower");
    const elFuelTyper = clone.querySelector(".card-fuelType");
    const elCountry = clone.querySelector(".card-country");





    const elInfoBtn = clone.querySelector(".js-info");
    const elEditBtn = clone.querySelector(".js-edit");
    const elDeleteBtn = clone.querySelector(".js-delete");

    elDeleteBtn.id = el.id;
    elEditBtn.id = el.id;
    elInfoBtn.href = `/pages/details.html?id=${el.id}`;

    elTitle.innerText ="Model: "+ el.name;
    elDescription.innerText ="Ma`lumot: "+ el.description;
    elTrim.innerText ="Trim: "+ el.trim;
    elYear.innerText = "Year: "+el.year;
    elMaxSpeed.innerText ="MaxSpeed: "+ el.maxSpeed;
    elEngine.innerText ="Engine: "+el.engine;
    elHorsePower.innerText ="HorsePower: "+el.horsepower;
    elFuelTyper.innerText = "FuelTyper: "+el.fuelType;
    elCountry.innerText = "Country: "+ el.country;



    elContainer.appendChild(clone);
  });
}

export function pagination(total, limit, skip) {
  const elPagination = document.getElementById("pagination");
  elPagination.innerHTML = "";
  const remained = total % limit;
  const pageCount = (total - remained) / limit;
  let activePage = skip / limit + 1;

  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement("button");
    button.classList.add("join-item", "btn", "js-page");
    if (activePage === i) {
      button.classList.add("btn-active");
    }
    button.innerText = i;
    button.dataset.skip = limit * i - limit;

    elPagination.appendChild(button);
  }
  // oxirgi sahifa
  if (remained > 0) {
    const button = document.createElement("button");
    button.classList.add("join-item", "btn", "js-page");
    if (activePage === pageCount + 1) {
      button.classList.add("btn-active");
    }
    button.innerText = pageCount + 1;
    elPagination.appendChild(button);
    button.dataset.skip = pageCount * limit;
  }
}
