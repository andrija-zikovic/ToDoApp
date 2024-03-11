import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import downArrow from "./icons/downArrow.svg";
import upArrow from "./icons/upArrow.svg";

const tableBody = document.querySelector(".tableBody");
let currentTable = [];

const renderMessage = (message) => {
  const messageBoxElement = document.querySelector(".messageBox");
  const messageElement = document.querySelector(".message");

  messageElement.textContent = message;
  messageBoxElement.style.display = "flex";

  setTimeout(() => {
    messageBoxElement.style.display = "none";
  }, 2000);
};

const getLocalToDos = () => {
  const storeData = localStorage.getItem("toDos");
  return storeData ? JSON.parse(storeData) : [];
};

let toDos = getLocalToDos();

const deleteToDo = (id) => {
  const select = document.querySelector(`#select${id}`);
  const stage = select.value;

  if (stage === "Done") {
    const index = toDos.findIndex((td) => td.id === id);
    const index2 = currentTable.findIndex((td) => td.id === id);

    toDos.splice(index, 1);
    currentTable.splice(index2, 1);

    saveToDosToLocal();

    const rowToDelete = document.querySelector(`#row${id}`);
    rowToDelete.remove();
  } else {
    renderMessage("You can't delete To Do until stage is Done!");
  }
};

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

const options = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const formatDate = (timestemp) => {
  return dayjs(timestemp).format("DD. MM. YYYY. HH:mm");
};

const createTableRowContent = (element) => {
  const tableRow = createDiv();
  tableRow.className = "tableBodyRow";
  tableRow.setAttribute("id", `row${element.id}`);

  const stage = createDiv();
  const select = document.createElement("select");

  select.setAttribute("id", `select${element.id}`);
  select.className = "selectInput";

  for (let key in options) {
    if (!options.hasOwnProperty(key)) continue;
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", key);
    optionElement.textContent = options[key];
    select.appendChild(optionElement);
  }

  select.selectedIndex = returnOptionIndex(element.stage);

  if (element.stage === "Done") {
    select.style.background = "green";
  } else if (element.stage === "In Progress") {
    select.style.background = "orange";
  } else {
    select.style.background = "";
  }

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

  const description = createDiv();
  description.textContent = element.description;
  tableRow.appendChild(description);

  const date = createDiv();
  date.textContent = formatDate(element.created_at);
  tableRow.appendChild(date);

  const deleteBox = createDiv();
  const deleteButton = document.createElement("button");

  deleteButton.setAttribute("id", element.id);
  deleteButton.className = "deleteButton";
  deleteButton.textContent = "DELETE";

  deleteButton.addEventListener("click", function () {
    deleteToDo(element.id);
  });

  deleteBox.appendChild(deleteButton);
  tableRow.appendChild(deleteBox);

  const firstChilde = tableBody.firstChild;
  tableBody.insertBefore(tableRow, firstChilde);
};

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

const createToDo = (text) => {
  let now = dayjs().valueOf();

  const data = {
    id: uuidv4(),
    description: text,
    stage: Object.freeze({
      PENDING: "Pending",
      IN_PROGRESS: "In Progress",
      DONE: "Done",
    }).PENDING,
    created_at: now,
  };

  toDos.push(data);
  currentTable.push(data);

  saveToDosToLocal();

  createTableRowContent(data, tableBody);
};

const stageChange = (newStage, id) => {
  const realId = id.slice(6);
  const index = toDos.find((td) => td.id === realId);
  const index2 = currentTable.find((td) => td.id === realId);
  console.log(newStage);
  index.stage = newStage;
  index2.stage = newStage;

  saveToDosToLocal();
};

const saveToDosToLocal = () => {
  localStorage.setItem("toDos", JSON.stringify(toDos));
};

const createDiv = () => {
  return document.createElement("div");
};

const renderTime = () => {
  setInterval(() => {
    const now = dayjs().toDate().toLocaleString();
    const dateElement = document.querySelector(".date");
    dateElement.textContent = now;
  }, 1000);
};

const filterByStage = (byStage) => {
  if (byStage === "All") {
    renderTable(toDos), "No ToDos to show!";
  } else {
    const filteredTabel = toDos.filter((todo) => todo.stage === byStage);
    renderTable(filteredTabel, "No ToDos to show!");
  }
};

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
