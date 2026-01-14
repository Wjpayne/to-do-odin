import './style.css'
import Todo from "../modules/todo.js";
import Project from "../modules/project.js";
import DOM from "../modules/dom.js";
import { load, save } from "../modules/storage";

function hydrateProjects(rawProjects) {
  return rawProjects.map(p => {
    const project = new Project(p.name);
    project.id = p.id;
    project.todos = p.todos.map(t => {
      const todo = new Todo(t.title, t.dueDate, t.priority);
      todo.id = t.id;
      todo.completed = t.completed;
      return todo;
    });
    return project;
  });
}

let projects = load();
if (!projects) {
  projects = [new Project("Default")];
} else {
  projects = hydrateProjects(projects);
}

let state = {
  currentProject: projects[0]
};

const dom = DOM(projects, state);
dom.render();

document.getElementById("add-project").onclick = () => {
  const input = document.getElementById("project-input");
  if (!input.value) return;
  const project = new Project(input.value);
  projects.push(project);
  save(projects);
  input.value = "";
  dom.render();
};

function resetTodoForm() {
  document.getElementById("todo-title").value = "";
  document.getElementById("todo-date").value = "";
  document.getElementById("todo-priority").value = "Low";

  document.getElementById("todo-title").focus();
}


document.getElementById("add-todo").onclick = () => {
  const title = document.getElementById("todo-title").value.trim();
  const date = document.getElementById("todo-date").value;
  const priority = document.getElementById("todo-priority").value;

  if (!title || !date) return;

  state.currentProject.addTodo(
    new Todo(title, date, priority)
  );

  save(projects);
  dom.render();
  resetTodoForm();
};

