import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { FeedbackService } from '@core/services/feedback.service';
import { FeedbackTypes } from '@core/enums/feedback-types.enum';
import { NotePageActions, NoteApiActions } from './actions';
import { NoteService } from '../services/note.service';

@Injectable()
export class NoteEffects {
  constructor(
    private actions$: Actions,
    private noteService: NoteService,
    private store: Store,
    private feedbackService: FeedbackService
  ) {}

  loadNotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotePageActions.loadNotes),
      mergeMap(() => {
        return this.noteService.findAll().pipe(
          map((notes) => {
            return NoteApiActions.loadNotesSuccess({ notes });
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'Notes could not be loaded',
              error.message
            );
            return of(NoteApiActions.loadNotesFailure({ error }));
          })
        );
      })
    );
  });

  createNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotePageActions.createNote),
      mergeMap((action) => {
        return this.noteService.create(action.note).pipe(
          mergeMap((note) => {
            return [NoteApiActions.createNoteSuccess({ note })];
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'Note could not be created',
              error.message
            );
            return of(NoteApiActions.createNoteFailure({ error }));
          })
        );
      })
    );
  });

  updateNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotePageActions.updateNote),
      mergeMap((action) => {
        return this.noteService.update(action.note.id, action.note).pipe(
          map((note) => {
            this.feedbackService.createMessage(
              FeedbackTypes.success,
              'Note successfully updated.'
            );
            return NoteApiActions.updateNoteSuccess({ note });
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'Note could not be updated',
              error.message
            );
            return of(NoteApiActions.updateNoteFailure({ error }));
          })
        );
      })
    );
  });

  deleteNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotePageActions.deleteNote),
      mergeMap((action) => {
        return this.noteService.remove(action.noteId).pipe(
          mergeMap((noteId) => {
            this.feedbackService.createMessage(
              FeedbackTypes.success,
              'Note successfully moved to trash.'
            );
            return [NoteApiActions.deleteNoteSuccess({ noteId })];
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'Note could not be moved to trash',
              error.message
            );
            return of(NoteApiActions.deleteNoteFailure({ error }));
          })
        );
      })
    );
  });
}
