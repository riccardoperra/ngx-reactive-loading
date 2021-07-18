import { ActionType, createAction, props } from '@ngrx/store';
import { Todo } from '../../../model/todo';

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

const todoActions = {
  todoAdd,
  todoRemove,
  todoReload,
  todoSet,
  todoAddSuccess,
  todoRemoveSuccess,
};

export type LoadingTodoActions = ActionType<
  typeof todoAdd | typeof todoRemove | typeof todoReload
>['type'];

export default todoActions;
