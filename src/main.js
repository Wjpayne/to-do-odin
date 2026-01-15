import "./style.css";
import Todo from "../modules/todo.js";
import Project from "../modules/project.js";
import DOM from "../modules/dom.js";
import { load, save } from "../modules/storage";

// Hydrate projects and todos from raw data

function hydrateProjects(rawProjects) {
  return rawProjects.map((p) => {
    const project = new Project(p.name);
    project.id = p.id;
    project.todos = p.todos.map((t) => {
      const todo = new Todo(t.title, t.dueDate, t.priority);
      todo.id = t.id;
      todo.completed = t.completed;
      return todo;
    });
    return project;
  });
}

// Load projects from storage or create default project

let projects = load();
if (!projects) {
  projects = [new Project("Default")];
} else {
  projects = hydrateProjects(projects);
}

// Application state

let state = {
  currentProject: projects[0],
};

const dom = DOM(projects, state);
dom.render();

// Add project button handler

document.getElementById("add-project").onclick = () => {
  const input = document.getElementById("project-input");
  if (!input.value) return;
  const project = new Project(input.value);
  projects.push(project);
  save(projects);
  input.value = "";
  dom.render();
};

// Reset todo form inputs

function resetTodoForm() {
  document.getElementById("todo-title").value = "";
  document.getElementById("todo-date").value = "";
  document.getElementById("todo-priority").value = "Low";

  document.getElementById("todo-title").focus();
}

//add todo button handler

document.getElementById("add-todo").onclick = () => {
  const title = document.getElementById("todo-title").value.trim();
  const date = document.getElementById("todo-date").value;
  const priority = document.getElementById("todo-priority").value;

  if (!title || !date) return;

  state.currentProject.addTodo(new Todo(title, date, priority));

  save(projects);
  dom.render();
  resetTodoForm();
};

// Set minimum date for todo date input to today

const dateInput = document.getElementById("todo-date");

function setMinDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

setMinDate();
