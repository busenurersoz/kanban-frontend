import { Note } from '@core/interfaces/note';
import { createAction, props } from '@ngrx/store';

export const loadNotes = createAction('[Note Page] Load Notes');

export const createNote = createAction(
  '[Note Page] Create Note',
  props<{ note: Note }>()
);

export const updateNote = createAction(
  '[Note Page] Update Note',
  props<{ note: Note }>()
);

export const deleteNote = createAction(
  '[Note Page] Delete Note',
  props<{ noteId: string }>()
);
