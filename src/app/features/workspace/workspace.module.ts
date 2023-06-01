import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { QuillModule } from 'ngx-quill';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { SharedModule } from '@shared/shared.module';

import { WorkspaceNotSelectedComponent } from './components/workspace-not-selected/workspace-not-selected.component';
import { WorkspaceFormComponent } from './components/workspace-form/workspace-form.component';
import { WorkspaceActionsComponent } from './components/workspace-actions/workspace-actions.component';
import { WorkspaceEffects } from './state/workspace.effects';
import { workspaceReducer } from './state/workspace.reducer';
import { WorkspaceHeaderComponent } from './components/workspace-header/workspace-header.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { WorkspaceCreateTodoComponent } from './components/workspace-create-todo/workspace-create-todo.component';
import { NoteModalComponent } from './components/note-modal/note-modal.component';

@NgModule({
  declarations: [
    WorkspaceNotSelectedComponent,
    WorkspaceFormComponent,
    WorkspaceActionsComponent,
    WorkspaceHeaderComponent,
    WorkspaceCreateTodoComponent,
    NoteModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature('workspace', workspaceReducer),
    EffectsModule.forFeature([WorkspaceEffects]),
    SharedModule,
  ],
  exports: [
    WorkspaceNotSelectedComponent,
    WorkspaceFormComponent,
    WorkspaceActionsComponent,
    WorkspaceHeaderComponent,
    WorkspaceCreateTodoComponent,
  ],
})
export class WorkspaceModule {}
