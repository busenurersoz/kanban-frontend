import { Todo } from '@core/interfaces/todo';
import { createAction, props } from '@ngrx/store';

export const loadTodosSuccess = createAction(
  '[Todo API] Load Success',
  props<{ todos: Todo[] }>()
);
export const loadTodosFailure = createAction(
  '[Todo API] Load Fail',
  props<{ error: string }>()
);

export const createTodoSuccess = createAction(
  '[Todo API] Create Todo Success',
  props<{ todo: Todo }>()
);
export const createTodoFailure = createAction(
  '[Todo API] Create Todo Fail',
  props<{ error: string }>()
);

export const updateTodoSuccess = createAction(
  '[Todo API] Update Todo Success',
  props<{ todo: Todo }>()
);
export const updateTodoFailure = createAction(
  '[Todo API] Update Todo Fail',
  props<{ error: string }>()
);

export const deleteTodoSuccess = createAction(
  '[Todo API] Delete Todo Success',
  props<{ todoId: string }>()
);
export const deleteTodoFailure = createAction(
  '[Todo API] Delete Todo Fail',
  props<{ error: string }>()
);
