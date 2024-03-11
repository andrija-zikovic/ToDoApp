import {
  createToDo,
  stageChange,
  deleteToDo,
  renderTable,
  renderTime,
  filterByStage,
  sortByDate,
} from "./todoHandler";
import { Stage } from "./stage";
import dayjs from "dayjs";

renderTable();

const createForm = document.querySelector("#createForm");

createForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const fromData = new FormData(createForm);
  const description = fromData.get("description");

  createToDo(description);

  document.querySelector("#description").value = "";
});

const deleteButtons = document.querySelectorAll(".deleteButton");

deleteButtons.forEach((button) => {
  button.addEventListener("click", function () {
    deleteToDo(button.id);
  });
});

const selectInputs = document.querySelectorAll(".selectInput");

selectInputs.forEach((select) => {
  if (!select.dataset.listenerAttached) {
    select.addEventListener("change", function (event) {
      const change = event.target.value;
      console.log(change);
      if (change === "DONE") {
        stageChange(Stage.DONE, select.id);
        select.style.background = "green";
      } else if (change === "IN_PROGRESS") {
        stageChange(Stage.IN_PROGRESS, select.id);
        select.style.background = "orange";
      } else {
        stageChange(Stage.PENDING, select.id);
        select.style.background = "";
      }
    });
    select.dataset.listenerAttached = true;
  }
});

const sortButtons = document.querySelectorAll(".sort");
sortButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const sortType = button.textContent;

    filterByStage(sortType);
  });
});

window.addEventListener("load", (event) => {
  const now = dayjs().toDate().toLocaleString();
  const dateElement = document.querySelector(".date");
  dateElement.textContent = now;
  renderTime();
});

const sortDate = document.querySelector(".sortDate");

sortDate.addEventListener("click", function () {
  const sortType = sortDate.value;

  sortByDate(sortType, sortDate);
});

const menu = document.querySelector(".menu");
const menuBox = document.querySelector(".menuBox");
menu.addEventListener("click", function () {
  menuBox.setAttribute("style", "visibility: visible");
});

window.addEventListener("click", function (event) {
  if (
    event.target !== menuBox &&
    event.target !== menu &&
    event.target !== menu.children[0]
  ) {
    menuBox.setAttribute("style", "visibility: hidden");
  }
});
