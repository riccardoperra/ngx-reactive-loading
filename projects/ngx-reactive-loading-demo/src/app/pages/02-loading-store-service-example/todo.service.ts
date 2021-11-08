import { Injectable } from '@angular/core';
import { Todo } from '../../model/todo';
import { BehaviorSubject, map, shareReplay, tap, withLatestFrom } from 'rxjs';
import { TodoApiService } from '../../services/todo-api.service';
import { TodoUtils } from '../../helpers/todo-utils';

interface TodoState {
  ids: string[];
  todos: {
    [key: string]: Todo;
  };
}

@Injectable()
export class TodoStateService {
  private readonly todoState = new BehaviorSubject<TodoState>({
    todos: {},
    ids: [],
  });

  readonly todos$ = this.todoState.pipe(
    map(todosState => Object.values(todosState.todos)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  constructor(private readonly todoApiService: TodoApiService) {}

  addTodo = (title: string) =>
    this.todoApiService.add(title).pipe(
      withLatestFrom(this.todoState),
      map(([todo, todoState]) => TodoUtils.addTodo(todoState, todo)),
      tap(state => this.todoState.next(state))
    );

  reloadTodos = () =>
    this.todoApiService.reload().pipe(
      map(todos => TodoUtils.setTodos(todos)),
      tap(state => this.todoState.next(state))
    );

  removeTodo = (id: string) =>
    this.todoApiService.remove(id).pipe(
      withLatestFrom(this.todoState),
      map(([, todoState]) => TodoUtils.removeTodo(todoState, id)),
      tap(state => this.todoState.next(state))
    );
}
