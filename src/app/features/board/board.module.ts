import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { IconsProviderModule } from 'src/app/icons-provider.module';
import { BoardHeaderComponent } from './components/board-header/board-header.component';
import { BoardFilterComponent } from './components/board-filter/board-filter.component';
import { BoardKanbanComponent } from './components/board-kanban/board-kanban.component';
import { BoardKanbanColumnComponent } from './components/board-kanban-column/board-kanban-column.component';
import { IssuesModule } from '@features/issues/issues.module';
import * as fromFilter from './state/filter.reducer';
import { WorkspaceModule } from '@features/workspace/workspace.module';
import { BoardWorkspaceComponent } from './components/board-workspace/board-workspace.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    BoardHeaderComponent,
    BoardFilterComponent,
    BoardKanbanComponent,
    BoardKanbanColumnComponent,
    BoardWorkspaceComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IconsProviderModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzAvatarModule,
    NzToolTipModule,
    NzDividerModule,
    IssuesModule,
    DragDropModule,
    StoreModule.forFeature(fromFilter.filterFeatureKey, fromFilter.reducer),
    NzMenuModule,
    NzDropDownModule,
    NzModalModule,
    NzCheckboxModule,
  ],
  exports: [
    BoardHeaderComponent,
    BoardFilterComponent,
    BoardKanbanComponent,
    BoardWorkspaceComponent,
  ],
})
export class BoardModule {}
