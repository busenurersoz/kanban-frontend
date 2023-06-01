import { Note } from '@core/interfaces/note';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NoteState } from './todo.reducer';

const getNoteFeatureState = createFeatureSelector<NoteState>('notes');

export const getAllNotes = createSelector(
  getNoteFeatureState,
  (state) => state?.notes
);

export const getNoteById = createSelector(
  getAllNotes,
  (notes: Note[], props: { noteId: string }) =>
    notes.find((p) => p.id === props.noteId)
);

export const getNoteError = createSelector(
  getNoteFeatureState,
  (state) => state.error
);
