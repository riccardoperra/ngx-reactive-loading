import { Injectable } from '@angular/core';
import { TodoStateService } from './todo.service';
import { Todo } from '../model/todo';
import { defer, Observable, of } from 'rxjs';
import { delay, mapTo, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TodoApiService {
  readonly delay = 1000;
  id = 0;

  constructor(private readonly todoService: TodoStateService) {}

  reload(): Observable<void> {
    return defer(() => {
      const n = this.getRandom(1, 20);
      console.log(n);
      return of(
        new Array(n)
          .fill(undefined)
          .map((todo, index) => this.buildTodo(`title_${index}`))
      );
    }).pipe(
      delay(this.getDelay()),
      tap(todos => this.todoService.set(todos)),
      mapTo(void 0)
    );
  }

  add(title: string): Observable<Todo> {
    const todo = {
      id: `${this.id++}_${new Date().toISOString()}`,
      title,
      completed: false,
    };

    return defer(() => {
      return of(todo);
    }).pipe(
      delay(this.getDelay()),
      tap(() => this.todoService.addTodo(todo))
    );
  }

  remove(id: string): Observable<boolean> {
    return defer(() => {
      return of(true);
    }).pipe(
      delay(this.getDelay()),
      tap(() => this.todoService.removeTodo(id))
    );
  }

  toggleCompleted(id: string): Observable<boolean> {
    return defer(() => {
      this.todoService.toggleCompleted(id);
      return of(true);
    }).pipe(delay(this.getDelay()));
  }

  private getDelay(): number {
    return this.getRandom(1, 5) * 1000;
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
