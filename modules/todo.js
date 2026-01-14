export default class Todo {
  constructor(title, dueDate, priority) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  update({ title, dueDate, priority }) {
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}