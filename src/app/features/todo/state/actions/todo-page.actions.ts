import { Todo } from '@core/interfaces/todo';
import { createAction, props } from '@ngrx/store';

export const setCurrentTodo = createAction(
  '[Todo Page] Set Current Todo',
  props<{ todoId: string }>()
);

export const loadTodos = createAction('[Todo Page] Load Todos');

export const createTodo = createAction(
  '[Todo Page] Create Todo',
  props<{ todo: Todo }>()
);

export const updateTodo = createAction(
  '[Todo Page] Update Todo',
  props<{ todo: Todo }>()
);

export const deleteTodo = createAction(
  '[Todo Page] Delete Todo',
  props<{ todoId: string }>()
);
