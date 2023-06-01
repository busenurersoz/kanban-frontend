import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzAlertModule } from 'ng-zorro-antd/alert';

import { BoardPageRoutingModule } from './board-page-routing.module';
import { BoardModule } from '@features/board/board.module';
import { ProjectModule } from '@features/project/project.module';
import { IssuesModule } from '@features/issues/issues.module';
import { WorkspaceModule } from '@features/workspace/workspace.module';
import { ProjectBoardComponent } from './project-board/project-board.component';
import { WorkspaceBoardComponent } from './workspace-board/workspace-board.component';

@NgModule({
  declarations: [ProjectBoardComponent, WorkspaceBoardComponent],
  imports: [
    BoardPageRoutingModule,
    CommonModule,
    BoardModule,
    ProjectModule,
    IssuesModule,
    NzAlertModule,
    WorkspaceModule,
    SharedModule,
  ],
  exports: [ProjectBoardComponent, WorkspaceBoardComponent],
})
export class BoardPageModule {}
