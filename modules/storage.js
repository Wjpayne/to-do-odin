const KEY = "todo-projects";

export function save(projects) {
  localStorage.setItem(KEY, JSON.stringify(projects));
}

export function load() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
}