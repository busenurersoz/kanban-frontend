import { Todo } from '@core/interfaces/todo';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TodoState } from './todo.reducer';

const getTodoFeatureState = createFeatureSelector<TodoState>('todos');

export const getAllTodos = createSelector(
  getTodoFeatureState,
  (state) => state?.todos
);

export const getTodoById = createSelector(
  getAllTodos,
  (todos: Todo[], props: { todoId: string }) =>
    todos.find((p) => p.id === props.todoId)
);

export const getTodoError = createSelector(
  getTodoFeatureState,
  (state) => state.error
);
