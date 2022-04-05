function addNew() {
  window.location.href = "/new-project";
}

function openProject(projectID) {
  window.location.href = "/project/" + projectID;
}

function deleteTask(taskID) {
  let delBtn = document.getElementById("delete-task-btn");
  delBtn.value = taskID;
}

function deleteProject(projectID) {
  let delBtn = document.getElementById("delete-project-btn");

  delBtn.value = projectID;
}

function searchFromTable() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("search-input");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

let infoState = false;
function infoShow() {
  if (infoState == false) {
    let infoTaskShow = document.getElementById("info-add-task");
    infoTaskShow.setAttribute("style", "height: 100px !important");
    infoState = true;
  } else {
    let infoTaskShow = document.getElementById("info-add-task");
    infoTaskShow.setAttribute("style", "height: 0 !important");
    infoTaskShow.style.opacity = "0";
    infoState = false;
  }
}

let projectTitle = document.getElementById("project-title");
let createProjectBtn = document.getElementById("create-project-btn");
let inputLengthShow = document.getElementById("input-length-identifier");

projectTitle
  .addEventListener("input", () => {
    let inputLength = projectTitle.value.trim().length;
    inputLengthShow.innerText = inputLength + "/30";
    if (inputLength > 5) {
      createProjectBtn.removeAttribute("disabled");
      inputLengthShow.classList.remove("text-danger");
    } else {
      createProjectBtn.disabled = true;
    }
    if (projectTitle.value == null) {
      createProjectBtn.disabled = true;
    }
    if (inputLength > 20) {
      inputLengthShow.classList.add("text-warning");
    } else {
      inputLengthShow.classList.remove("text-warning");
    }
    if (inputLength > 30) {
      createProjectBtn.disabled = true;
      inputLengthShow.classList.add("text-danger");
    }
  })

