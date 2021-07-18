import { Injectable } from '@angular/core';
import { Todo } from '../model/todo';
import { defer, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TodoApiService {
  readonly delay = 1000;
  id = 0;

  constructor() {}

  reload(): Observable<Todo[]> {
    return defer(() => {
      const n = this.getRandom(1, 20);
      return of(
        new Array(n)
          .fill(undefined)
          .map((todo, index) => this.buildTodo(`title_${index}`))
      );
    }).pipe(delay(this.getDelay()));
  }

  add(title: string): Observable<Todo> {
    const todo = {
      id: `${this.id++}_${new Date().toISOString()}`,
      title,
      completed: false,
    };

    return defer(() => {
      return of(todo);
    }).pipe(delay(this.getDelay()));
  }

  remove(id: string): Observable<boolean> {
    return defer(() => {
      return of(true);
    }).pipe(delay(this.getDelay()));
  }

  private getDelay(): number {
    return this.getRandom(1, 3) * this.delay;
  }

  private getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  private buildTodo(title: string): Todo {
    return {
      id: `${this.id++}_${new Date().toISOString()}`,
      title,
      completed: false,
    };
  }
}
