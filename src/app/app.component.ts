import { Component, OnInit } from '@angular/core';
import { Todo } from './model/todo.model';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  todos: any;
  newTodoText = '';

  constructor(public todoService: TodoService) {}

  private parseId(name: string) {
    return name.substring(name.lastIndexOf('/'))
  }

  ngOnInit() {
    this.getAllTodos();
  }

  getAllTodos() {
    this.todoService.findAllTodos().subscribe(data => {
      
      this.todos = data.documents? data.documents.map(todo => {
        return {
          id: this.parseId(todo.name),
          completed: todo.fields.completed.booleanValue,
          title: todo.fields.title? todo.fields.title.stringValue : ""
        };
      }) : []
    });
  }

  stopEditing(todo: Todo, editedTitle: string) {
    todo.title = editedTitle;
    todo.editing = false;
    this.getAllTodos();

  }

  cancelEditingTodo(todo: Todo) {
    todo.editing = false;
    this.getAllTodos();
  }

  updateEditingTodo(todo: Todo, editedTitle: string) {
    editedTitle = editedTitle.trim();
    todo.editing = false;

    if (editedTitle.length === 0) {
      return this.todoService.remove(todo).subscribe(() => {
        this.getAllTodos();
      });
    }

    todo.title = editedTitle;
  }

  editTodo(todo: Todo) {
    todo.editing = true;
  }

  toggleCompletion(todo: Todo) {
    this.todoService.toggleCompletion(todo).subscribe(() => {
      this.getAllTodos();
    });
  }

  remove(todo: Todo) {
    this.todoService.remove(todo).subscribe(() => {
      this.getAllTodos();
    });
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
      this.todoService.add(this.newTodoText).subscribe(() => {
        this.getAllTodos();
      });
      this.newTodoText = '';
    }
  }

}
