import { Component, OnInit } from '@angular/core';
import { TodoService} from './todo.service';
import { Todo } from './model/todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'todo-pwa';

  todos: any[];
  newTodoText = '';


  constructor(public todoService: TodoService) { }

  ngOnInit() {
    this.todoService.findAllTodos().subscribe(data => {
      this.todos = data.map(todo => {
        return {
          id: todo.payload.doc.id,
          ...todo.payload.doc.data()
        }
      })
    })
  }

  stopEditing(todo: Todo, editedTitle: string) {
    todo.title = editedTitle;
    todo.editing = false;
  }

  cancelEditingTodo(todo: Todo) {
    todo.editing = false;
  }

  updateEditingTodo(todo: Todo, editedTitle: string) {
    editedTitle = editedTitle.trim();
    todo.editing = false;

    if (editedTitle.length === 0) {
      return this.todoService.remove(todo);
    }

    todo.title = editedTitle;
  }

  editTodo(todo: Todo) {
    todo.editing = true;
  }

  toggleCompletion(todo: Todo) {
    this.todoService.toggleCompletion(todo);
  }


  remove(todo: Todo) {
    this.todoService.remove(todo);
  }

  addTodo (title: string) {
    if (this.newTodoText.trim().length) {
      this.todoService.add(this.newTodoText);
      this.newTodoText = '';
    }
  }

  allCompleted() {
    return this.todos.length === this.getCompleted().length;
  }

  getRemaining() {
    return this.getWithCompleted(false);
  }

  getCompleted() {
    return this.getWithCompleted(true);
  }

  private getWithCompleted(completed: boolean) {
    return this.todos.filter((todo: Todo) => todo.completed === completed);
  }




}
