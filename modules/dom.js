import { save } from "./storage";

export default function DOM(projects, state) {
  const projectList = document.getElementById("project-list");
  const todoList = document.getElementById("todo-list");
  const title = document.getElementById("current-project");

  function renderProjects() {
    projectList.innerHTML = "";

    projects.forEach((project) => {
      const li = document.createElement("li");

      const name = document.createElement("span");
      name.textContent = project.name;
      name.onclick = () => {
        state.currentProject = project;
        render();
      };

      li.appendChild(name);

      if (project.name !== "Default") {
        const delBtn = document.createElement("button");
        delBtn.textContent = "✕";
        delBtn.onclick = () => {
          if (confirm(`Delete "${project.name}" project?`)) {
            deleteProject(project.id);
          }
        };
        li.appendChild(delBtn);
      }

      projectList.appendChild(li);
    });
  }

  function deleteProject(projectId) {
    const index = projects.findIndex((p) => p.id === projectId);
    if (index === -1) return;

    // if deleting current project, fallback
    if (projects[index].id === state.currentProject.id) {
      state.currentProject =
        projects[index - 1] || projects[index + 1] || projects[0];
    }

    projects.splice(index, 1);
    save(projects);
    render();
  }

  function renderTodos() {
    todoList.innerHTML = "";

    state.currentProject.todos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item priority-${todo.priority.toLowerCase()}`;
      if (todo.completed) li.classList.add("completed");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.onchange = () => {
        todo.toggleComplete();
        save(projects);
        render();
      };

      const text = document.createElement("span");
      text.textContent = `${todo.title} (${todo.dueDate})`;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => renderEditForm(todo);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "✕";
      deleteBtn.onclick = () => {
        state.currentProject.removeTodo(todo.id);
        save(projects);
        render();
      };

      li.append(checkbox, text, editBtn, deleteBtn);
      todoList.appendChild(li);
    });
  }

  function renderEditForm(todo) {
    todoList.innerHTML = "";

    const li = document.createElement("li");

    const titleInput = document.createElement("input");
    titleInput.value = todo.title;

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = todo.dueDate;

    const prioritySelect = document.createElement("select");
    ["Low", "Medium", "High"].forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      if (p === todo.priority) opt.selected = true;
      prioritySelect.appendChild(opt);
    });

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.onclick = () => {
      todo.update({
        title: titleInput.value,
        dueDate: dateInput.value,
        priority: prioritySelect.value,
      });
      save(projects);
      render();
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = render;

    li.append(titleInput, dateInput, prioritySelect, saveBtn, cancelBtn);

    todoList.appendChild(li);
  }

  function render() {
    title.textContent = state.currentProject.name;
    renderProjects();
    renderTodos();
  }

  return { render };
}
