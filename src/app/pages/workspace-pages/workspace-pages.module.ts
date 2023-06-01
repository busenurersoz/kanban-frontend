import { SharedModule } from '@shared/shared.module';
import { WorkspaceModule } from '@features/workspace/workspace.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspacePagesRoutingModule } from './workspace-pages-routing.module';
import { WorkspaceCreatePageComponent } from './workspace-create-page/workspace-create-page.component';
import { WorkspaceEditPageComponent } from './workspace-edit-page/workspace-edit-page.component';
import { WorkspaceListPageComponent } from './workspace-list-page/workspace-list-page.component';
import { WorkspaceBoardPageComponent } from './workspace-board-page/workspace-board-page.component';
import { BoardModule } from '@features/board/board.module';
import { WorkspaceProjectsListPageComponent } from './workspace-projects-list-page/workspace-projects-list-page.component';
import { ProjectModule } from '@features/project/project.module';
import { TodoModule } from '@features/todo/todo.module';

@NgModule({
  declarations: [
    WorkspaceCreatePageComponent,
    WorkspaceEditPageComponent,
    WorkspaceListPageComponent,
    WorkspaceBoardPageComponent,
    WorkspaceProjectsListPageComponent,
  ],
  imports: [
    CommonModule,
    WorkspacePagesRoutingModule,
    WorkspaceModule,
    SharedModule,
    BoardModule,
    ProjectModule,
    TodoModule,
  ],
  exports: [],
})
export class WorkspacePagesModule {}
