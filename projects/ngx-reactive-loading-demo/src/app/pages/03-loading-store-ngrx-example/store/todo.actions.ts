import { ActionType, createAction, props } from '@ngrx/store';
import { Todo } from '../../../model/todo';
import { InjectionToken } from '@angular/core';

const todoAdd = createAction('[Todo] Add todo', props<{ message: string }>());
const todoRemove = createAction('[Todo] Remove todo', props<{ id: string }>());
const todoReload = createAction('[Todo] Reload todo');

const todoSet = createAction('[Todo] Set todos', props<{ todos: Todo[] }>());

const todoAddSuccess = createAction(
  '[Todo] Todo add success',
  props<{ todo: Todo }>()
);

const todoRemoveSuccess = createAction(
  '[Todo] Todo remove success',
  props<{ id: string }>()
);

export const todoActions = {
  todoAdd,
  todoRemove,
  todoReload,
  todoSet,
  todoAddSuccess,
  todoRemoveSuccess,
};

export const TODO_ACTION_LOADING_KEYS = Object.values(todoActions).map(
  k => k.type
);

export type TodoActions = typeof todoActions;

export type LoadingTodoActions = ActionType<
  typeof todoAdd | typeof todoRemove | typeof todoReload
>['type'];

export const TODO_ACTIONS = new InjectionToken<TodoActions>(
  'todoActions token',
  { factory: () => todoActions, providedIn: 'root' }
);
