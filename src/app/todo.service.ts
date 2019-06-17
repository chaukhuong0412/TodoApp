import { Todo } from './model/todo.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class TodoService {

  constructor(private firestore: AngularFirestore) {}

  

  findAllTodos() {
    return this.firestore.collection('Todos').snapshotChanges();
  }

  updateTodo(id: string, todo: {}) {
    return this.firestore.collection('Todos').doc(id).set(todo, { merge: true });
  }

  remove(todo: Todo) {
    return this.firestore.collection('Todos').doc(todo.id).delete();
  }

  add(title: string) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
      .collection('Todos')
      .add({ title, completed: false })
      .then(res => {}, err => reject(err));
    });
  }

  toggleCompletion(todo: Todo) {
    console.log(todo);
    this.updateTodo(todo.id, { completed: !todo.completed });
  }

}
