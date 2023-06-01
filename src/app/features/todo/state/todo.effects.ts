import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { FeedbackService } from '@core/services/feedback.service';
import { FeedbackTypes } from '@core/enums/feedback-types.enum';
import { TodoService } from '../services/todo.service';
import { TodoApiActions, TodoPageActions } from './actions';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private todoService: TodoService,
    private store: Store,
    private feedbackService: FeedbackService
  ) {}

  loadTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoPageActions.loadTodos),
      mergeMap(() => {
        return this.todoService.findAll().pipe(
          map((todos) => {
            return TodoApiActions.loadTodosSuccess({ todos });
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'Todos could not be loaded',
              error.message
            );
            return of(TodoApiActions.loadTodosFailure({ error }));
          })
        );
      })
    );
  });

  createTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoPageActions.createTodo),
      mergeMap((action) => {
        return this.todoService.create(action.todo).pipe(
          mergeMap((todo) => {
            return [TodoApiActions.createTodoSuccess({ todo })];
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'Todo could not be created',
              error.message
            );
            return of(TodoApiActions.createTodoFailure({ error }));
          })
        );
      })
    );
  });

  updateTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoPageActions.updateTodo),
      mergeMap((action) => {
        return this.todoService.update(action.todo.id, action.todo).pipe(
          map((todo) => {
            this.feedbackService.createMessage(
              FeedbackTypes.success,
              'Todo successfully updated.'
            );
            return TodoApiActions.updateTodoSuccess({ todo });
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'Todo could not be updated',
              error.message
            );
            return of(TodoApiActions.updateTodoFailure({ error }));
          })
        );
      })
    );
  });

  deleteTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoPageActions.deleteTodo),
      mergeMap((action) => {
        return this.todoService.remove(action.todoId).pipe(
          mergeMap((todoId) => {
            this.feedbackService.createMessage(
              FeedbackTypes.success,
              'Todo successfully moved to trash.'
            );
            return [TodoApiActions.deleteTodoSuccess({ todoId })];
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'Todo could not be moved to trash',
              error.message
            );
            return of(TodoApiActions.deleteTodoFailure({ error }));
          })
        );
      })
    );
  });
}
