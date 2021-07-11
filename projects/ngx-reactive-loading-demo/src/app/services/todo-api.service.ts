import { Injectable } from '@angular/core';
import { TodoStateService } from './todo.service';
import { Todo } from '../model/todo';
import { defer, Observable, of } from 'rxjs';
import { delay, mapTo, tap } from 'rxjs/operators';

@Injectable()
export class TodoApiService {
  readonly delay = 1000;
  id = 0;

  constructor(private readonly todoService: TodoStateService) {}

  reload(): Observable<void> {
    return defer(() => {
      const n = Math.floor(Math.random() * 10);
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
      this.todoService.removeTodo(id);
      return of(true);
    }).pipe(delay(this.getDelay()));
  }

  toggleCompleted(id: string): Observable<boolean> {
    return defer(() => {
      this.todoService.toggleCompleted(id);
      return of(true);
    }).pipe(delay(this.getDelay()));
  }

  private getDelay(): number {
    return Math.floor(Math.random() * 5) * 1000;
  }

  private buildTodo(title: string): Todo {
    return {
      id: `${this.id++}_${new Date().toISOString()}`,
      title,
      completed: false,
    };
  }
}
