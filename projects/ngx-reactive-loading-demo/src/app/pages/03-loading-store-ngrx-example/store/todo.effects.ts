import { Inject, Injectable } from '@angular/core';
import { TodoApiService } from '../../../services/todo-api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import todoActions, { LoadingTodoActions } from './todo.actions';
import { EMPTY, catchError, exhaustMap, map, tap } from 'rxjs';
import { LoadingService } from 'ngx-reactive-loading';

@Injectable()
export class TodoEffects {
  reloadTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(todoActions.todoReload),
      exhaustMap(() =>
        this.todoApiService.reload().pipe(
          map(todos => todoActions.todoSet({ todos })),
          this.loadingService.track(todoActions.todoReload.type),
          catchError(() => EMPTY)
        )
      )
    )
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(todoActions.todoAdd),
      tap(console.log),
      exhaustMap(({ message }) =>
        this.todoApiService.add(message).pipe(
          map(todo => todoActions.todoAddSuccess({ todo })),
          this.loadingService.track(todoActions.todoAdd.type),
          catchError(() => EMPTY)
        )
      )
    )
  );

  removeTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(todoActions.todoRemove),
      exhaustMap(({ id }) =>
        this.todoApiService.remove(id).pipe(
          map(() => todoActions.todoRemoveSuccess({ id })),
          this.loadingService.track(todoActions.todoRemove.type),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private todoApiService: TodoApiService,
    private readonly loadingService: LoadingService<LoadingTodoActions>
  ) {}
}
