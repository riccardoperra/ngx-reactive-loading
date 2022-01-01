import { createSelector } from '@ngrx/store';
import { todoFeature } from './todo.feature';

export const { selectTodoState, selectTodos } = todoFeature;

export { todoFeature };

export const selectTodosList = createSelector(selectTodoState, state =>
  Object.values(state.todos)
);
