import { Component, OnInit } from '@angular/core';
import { Todo } from './model/todo.model';
import { TodoService } from './todo.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  todos: any;
  newTodoText = '';
  text: string;

  constructor(public todoService: TodoService, private http: HttpClient) {}

  ngOnInit() {

    this.http.get('https://firestore.googleapis.com/v1/projects/pwa-todo-95bd1/databases/(default)/documents/Todos/').subscribe(res => {
      this.text = res.toString();
      console.log(res);
    })

    this.todoService.findAllTodos().subscribe(data => {
      this.todos = data.map(todo => {
        return {
          id: todo.payload.doc.id,
          ...todo.payload.doc.data()
        };
      })
    });
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

  addTodo() {
    if (this.newTodoText.trim().length) {
      this.todoService.add(this.newTodoText);
      this.newTodoText = '';
    }
  }

}
