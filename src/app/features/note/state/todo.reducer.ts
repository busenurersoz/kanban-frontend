import { Note } from '@core/interfaces/note';
import { createReducer, on } from '@ngrx/store';

import { NoteApiActions, NotePageActions } from './actions';

export interface NoteState {
  notes: Note[];
  error: string;
}

const initialState: NoteState = {
  notes: [],
  error: null,
};

export const noteReducer = createReducer<NoteState>(
  initialState,
  on(NoteApiActions.loadNotesSuccess, (state, action): NoteState => {
    return {
      ...state,
      notes: action.notes,
      error: null,
    };
  }),
  on(NoteApiActions.loadNotesFailure, (state, action): NoteState => {
    return {
      ...state,
      error: action.error,
    };
  }),
  on(NoteApiActions.createNoteSuccess, (state, action): NoteState => {
    return {
      ...state,
      notes: [...state.notes, action.note],
    };
  }),
  on(NoteApiActions.updateNoteSuccess, (state, action): NoteState => {
    const updatedNotes = state.notes.map((note) =>
      action.note.id === note.id ? action.note : note
    );
    return {
      ...state,
      notes: updatedNotes,
    };
  }),

  on(NoteApiActions.deleteNoteSuccess, (state, action): NoteState => {
    const updatedNotes = state.notes.filter((p) => p.id !== action.noteId);
    return {
      ...state,
      notes: updatedNotes,
    };
  })
);
