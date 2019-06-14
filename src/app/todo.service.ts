import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Todo } from './model/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private firestore: AngularFirestore) { }

  findAllTodos() {
    return this.firestore.collection('Todos').snapshotChanges();
  }

  updateTodo(id:string, todo: {}) {
    return this.firestore.collection('Todos').doc(id).set(todo, {merge : true});
  }


  remove(todo: Todo) {
    return this.firestore.collection('Todos').doc(todo.id).delete();
  }

  add(title: string) {
    return this.firestore.collection('Todos').add({ title, completed: false});
  }


  toggleCompletion(todo: Todo) {
    console.log(todo);
    this.updateTodo(todo.id, { completed: !todo.completed });
  }

}
