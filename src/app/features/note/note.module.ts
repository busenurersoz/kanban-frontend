import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { noteReducer } from './state/todo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { NoteEffects } from './state/todo.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('notes', noteReducer),
    EffectsModule.forFeature([NoteEffects]),
  ],

  exports: [],
})
export class NoteModule {}
