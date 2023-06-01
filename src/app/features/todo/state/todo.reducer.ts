import { Todo } from './../../../core/interfaces/todo';
import { createReducer, on } from '@ngrx/store';

import { TodoApiActions, TodoPageActions } from './actions';

export interface TodoState {
  todos: Todo[];
  error: string;
}

const initialState: TodoState = {
  todos: [],
  error: null,
};

export const todoReducer = createReducer<TodoState>(
  initialState,
  on(TodoApiActions.loadTodosSuccess, (state, action): TodoState => {
    return {
      ...state,
      todos: action.todos,
      error: null,
    };
  }),
  on(TodoApiActions.loadTodosFailure, (state, action): TodoState => {
    return {
      ...state,
      error: action.error,
    };
  }),
  on(TodoApiActions.createTodoSuccess, (state, action): TodoState => {
    return {
      ...state,
      todos: [...state.todos, action.todo],
    };
  }),
  on(TodoApiActions.updateTodoSuccess, (state, action): TodoState => {
    const updatedTodos = state.todos.map((workspace) =>
      action.todo.id === workspace.id ? action.todo : workspace
    );
    return {
      ...state,
      todos: updatedTodos,
    };
  }),

  on(TodoApiActions.deleteTodoSuccess, (state, action): TodoState => {
    const updatedTodos = state.todos.filter((p) => p.id !== action.todoId);
    return {
      ...state,
      todos: updatedTodos,
    };
  })
);
