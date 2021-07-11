import { Injectable } from '@angular/core';
import { Todo } from '../model/todo';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

interface TodoState {
  ids: string[];
  todos: {
    [key: string]: Todo;
  };
}

@Injectable({ providedIn: 'root' })
export class TodoStateService {
  private readonly todoState = new BehaviorSubject<TodoState>({
    todos: {},
    ids: [],
  });

  readonly todos$ = this.todoState.pipe(
    map(todosState => Object.values(todosState.todos)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  constructor() {}

  set(todos: Todo[]): void {
    this.todoState.next({
      ids: todos.map(todo => todo.id),
      todos: todos.reduce<Record<string, Todo>>((acc, todo) => {
        acc[todo.id] = todo;
        return acc;
      }, {}),
    });
  }

  addTodo(todo: Todo): void {
    const value = this.todoState.getValue();
    this.todoState.next({
      ids: [...value.ids, todo.id],
      todos: {
        ...value.todos,
        [todo.id]: todo,
      },
    });
  }

  toggleCompleted(id: string): void {
    const value = this.todoState.getValue();
    const todo = value.todos[id];
    if (todo) {
      return this.todoState.next({
        ...value,
        todos: {
          ...value.todos,
          [id]: { ...todo, completed: !todo.completed },
        },
      });
    }
  }

  removeTodo(id: string): void {
    const value = this.todoState.getValue();
    const todo = value.todos[id];
    if (todo) {
      return this.todoState.next({
        ids: value.ids.filter(todoId => todoId !== id),
        todos: Object.entries(value.todos).reduce<{ [key: string]: Todo }>(
          (acc, [todoId, todo]) => {
            if (id === todoId) {
              return acc;
            }
            acc[todoId] = todo;
            return acc;
          },
          {}
        ),
      });
    }
  }
}
