import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { todoReducer } from './state/todo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from './state/todo.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('todos', todoReducer),
    EffectsModule.forFeature([TodoEffects]),
  ],

  exports: [],
})
export class TodoModule {}
