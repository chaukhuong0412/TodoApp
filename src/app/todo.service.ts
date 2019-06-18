import { Todo } from './model/todo.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http'; 
import { from , Observable } from 'rxjs';


@Injectable()
export class TodoService {

  constructor(private firestore: AngularFirestore, private http: HttpClient) {}

  

  findAllTodos(): any {
    return this.http.get('https://firestore.googleapis.com/v1/projects/pwa-todo-95bd1/databases/(default)/documents/Todos/');
    //return this.firestore.collection('Todos').snapshotChanges();
  }

  updateTodo(id: string, todo: {}) {
    return from(this.firestore.collection('Todos').doc(id).set(todo, { merge: true }));
  }

  remove(todo: Todo) {
    return from(this.firestore.collection('Todos').doc(todo.id).delete());
  }

  add(title: string) {
    return from(this.firestore.collection('Todos').add({ title, completed: false }));
  }

  toggleCompletion(todo: Todo) {
    return this.updateTodo(todo.id, { completed: !todo.completed });
  }

}
