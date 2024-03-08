import {
  createToDo,
  stageChange,
  deleteToDo,
  renderTable,
  renderTime,
} from "./functions";

// Rendering initial table
renderTable();

// Event listener for creating new ToDo
const createForm = document.querySelector("#createForm");
createForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const fromData = new FormData(createForm);
  const description = fromData.get("description");
  // Creating new ToDo
  createToDo(description);
  // Clearing input
  document.querySelector("#description").value = "";
});

// Event listener for delete button
const deleteButtons = document.querySelectorAll(".deleteButton");
deleteButtons.forEach((button) => {
  button.addEventListener("click", function () {
    deleteToDo(button.id);
  });
});

// Event listener for stage change
const selectInputs = document.querySelectorAll(".selectInput");
selectInputs.forEach((select) => {
  select.addEventListener("change", function (event) {
    const change = event.target.value;
    // Changing stage
    stageChange(change, select.id);
    // Changing background color of select element
    if (change === "Done") {
      select.style.background = "green";
    } else if (change === "In Progress") {
      select.style.background = "orange";
    } else {
      select.style.background = "";
    }
  });
});

// Rendering time
setInterval(() => {
  const dateElement = document.querySelector(".date");
  dateElement.textContent = renderTime();
}, 1000);
