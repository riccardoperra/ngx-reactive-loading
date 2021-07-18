import { createSelector } from '@ngrx/store';
import { AppState } from './';

export const selectFeature = (state: AppState) => state.todo;

export const selectTodos = createSelector(selectFeature, state =>
  Object.values(state.todos)
);

const todoSelector = {
  selectTodos,
};

export default todoSelector;
