import { Inject, Injectable } from '@angular/core';
import { TodoApiService } from '../../../services/todo-api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoadingTodoActions, TODO_ACTIONS, TodoActions } from './todo.actions';
import { catchError, EMPTY, exhaustMap, map } from 'rxjs';
import { LoadingService } from 'ngx-reactive-loading';

@Injectable()
export class TodoEffects {
  reloadTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.todoActions.todoReload),
      exhaustMap(() =>
        this.todoApiService.reload().pipe(
          map(todos => this.todoActions.todoSet({ todos })),
          this.loadingService.track(this.todoActions.todoReload.type),
          catchError(() => EMPTY)
        )
      )
    )
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.todoActions.todoAdd),
      exhaustMap(({ message }) =>
        this.todoApiService.add(message).pipe(
          map(todo => this.todoActions.todoAddSuccess({ todo })),
          this.loadingService.track(this.todoActions.todoAdd.type),
          catchError(() => EMPTY)
        )
      )
    )
  );

  removeTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.todoActions.todoRemove),
      exhaustMap(({ id }) =>
        this.todoApiService.remove(id).pipe(
          map(() => this.todoActions.todoRemoveSuccess({ id })),
          this.loadingService.track(this.todoActions.todoRemove.type),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    @Inject(TODO_ACTIONS) private readonly todoActions: TodoActions,
    private readonly actions$: Actions,
    private readonly todoApiService: TodoApiService,
    private readonly loadingService: LoadingService<LoadingTodoActions>
  ) {}
}
