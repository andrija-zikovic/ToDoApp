import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import downArrow from "./icons/downArrow.svg";
import upArrow from "./icons/upArrow.svg";

// Getting tabel body elements from the DOM
const tableBody = document.querySelector(".tableBody");
let currentTable = [];

// Function for message rendering
const renderMessage = (message) => {
  const messageBoxElement = document.querySelector(".messageBox");
  const messageElement = document.querySelector(".message");

  messageElement.textContent = message;
  messageBoxElement.style.display = "flex";

  setTimeout(() => {
    messageBoxElement.style.display = "none";
  }, 2000);
};

// Function for getting ToDos from local storage
const getLocalToDos = () => {
  const storeData = localStorage.getItem("toDos");
  return storeData ? JSON.parse(storeData) : [];
};

// Getting ToDos from local storage
let toDos = getLocalToDos();

// Function for deleting ToDo
const deleteToDo = (id) => {
  // Getting select element by id for checking stage progress "Done", "In Progress", "Pending"
  const select = document.querySelector(`#select${id}`);
  const stage = select.value;
  // Checking stage progress "Done", "In Progress", "Pending"
  if (stage === "Done") {
    const index = toDos.findIndex((td) => td.id === id);
    const index2 = currentTable.findIndex((td) => td.id === id);

    toDos.splice(index, 1);
    currentTable.splice(index2, 1);

    saveToDosToLocal();

    const rowToDelete = document.querySelector(`#row${id}`);
    rowToDelete.remove();
  } else {
    // If stage is not "Done" render message
    renderMessage("You can't delete To Do until stage is Done!");
  }
};

// Function for returning option index so we can set select element to the right option
const returnOptionIndex = (option) => {
  if (option === "Pending") {
    return 0;
  } else if (option === "In Progress") {
    return 1;
  } else if (option === "Done") {
    return 2;
  } else {
    return new Error("Wrong option");
  }
};

// Function for formating date
const formatDate = (timestemp) => {
  return dayjs(timestemp).format("DD. MM. YYYY. HH:mm");
};

// Function for creating table row content
const createTableRowContent = (element) => {
  // Creating Table Row
  const tableRow = createDiv();
  tableRow.className = "tableBodyRow";
  tableRow.setAttribute("id", `row${element.id}`);

  // Creating Table Row Stage Select Column
  const stage = createDiv();
  const select = document.createElement("select");

  select.setAttribute("id", `select${element.id}`);
  select.className = "selectInput";

  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", option);
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });

  select.selectedIndex = returnOptionIndex(element.stage);

  // Changing color of select elemet by progress "Done", "In Progress", "Pending"
  if (element.stage === "Done") {
    select.style.background = "green";
  } else if (element.stage === "In Progress") {
    select.style.background = "orange";
  } else {
    select.style.background = "";
  }

  // Adding event listener for new select
  select.addEventListener("change", function (event) {
    const change = event.target.value;
    stageChange(change, select.id);
    if (change === "Done") {
      select.style.background = "green";
    } else if (change === "In Progress") {
      select.style.background = "orange";
    } else {
      select.style.background = "";
    }
  });

  stage.appendChild(select);
  tableRow.appendChild(stage);

  // Creating Table Row Description Colum
  const description = createDiv();
  description.textContent = element.description;
  tableRow.appendChild(description);

  // Creating Table Row Create At Column
  const date = createDiv();
  date.textContent = formatDate(element.created_at);
  tableRow.appendChild(date);

  // Creating Table Row Delete Button Column
  const deleteBox = createDiv();
  const deleteButton = document.createElement("button");

  deleteButton.setAttribute("id", element.id);
  deleteButton.className = "deleteButton";
  deleteButton.textContent = "DELETE";

  // Adding new event listener for delete button
  deleteButton.addEventListener("click", function () {
    deleteToDo(element.id);
  });

  deleteBox.appendChild(deleteButton);
  tableRow.appendChild(deleteBox);

  // Adding Table Row to the table
  const firstChilde = tableBody.firstChild;
  tableBody.insertBefore(tableRow, firstChilde);
};

// Function for rendering table
const renderTable = (
  newTable = getLocalToDos(),
  message = "No ToDos to show!"
) => {
  currentTable = newTable;
  tableBody.innerHTML = "";

  if (newTable.length === 0) {
    renderMessage(message);
  } else {
    newTable.forEach((element) => {
      createTableRowContent(element, tableBody);
    });
  }
};

// Function for creating new ToDo
const createToDo = (text) => {
  let now = dayjs().valueOf();

  const data = {
    id: uuidv4(),
    description: text,
    stage: "Pending",
    created_at: now,
  };

  toDos.push(data);
  currentTable.push(data);

  // Saving new ToDo to local storage
  saveToDosToLocal();

  // Creating new row in the table with new ToDo
  createTableRowContent(data, tableBody);
};

// Function for changing stage of ToDo
const stageChange = (newStage, id) => {
  const realId = id.slice(6);
  const index = toDos.find((td) => td.id === realId);
  const index2 = currentTable.find((td) => td.id === realId);
  index.stage = newStage;
  index2.stage = newStage;
  // Saving new stage to local storage
  saveToDosToLocal();
};

// Function for saving ToDos to local storage
const saveToDosToLocal = () => {
  localStorage.setItem("toDos", JSON.stringify(toDos));
};

// Array of options for select element
const options = ["Pending", "In Progress", "Done"];

// Function for creating new div element
const createDiv = () => {
  return document.createElement("div");
};

// Function for rendering time
const renderTime = () => {
  const now = dayjs().toDate().toLocaleString();
  return now;
};

// Function for filtering ToDos by stage
const filterByStage = (byStage) => {
  if (byStage === "All") {
    renderTable(toDos), "No ToDos to show!";
  } else {
    const filteredTabel = toDos.filter((todo) => todo.stage === byStage);
    renderTable(filteredTabel, "No ToDos to show!");
  }
};

// Sorting table by date
const sortByDate = (sort, element) => {
  if (sort === "Newest") {
    currentTable.sort((a, b) => {
      return b.created_at - a.created_at;
    });

    element.value = "Oldest";
    element.innerHTML = "";

    const img = document.createElement("img");
    img.src = downArrow;

    element.appendChild(img);
  } else {
    currentTable.sort((a, b) => {
      return a.created_at - b.created_at;
    });

    element.value = "Newest";
    element.innerHTML = "";

    const img = document.createElement("img");
    img.src = upArrow;

    element.appendChild(img);
  }
  renderTable(currentTable, "No ToDos to show!");
};

export {
  createToDo,
  deleteToDo,
  stageChange,
  renderTime,
  renderTable,
  filterByStage,
  sortByDate,
};
