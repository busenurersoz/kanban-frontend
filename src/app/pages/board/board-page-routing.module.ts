import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectBoardComponent } from './project-board/project-board.component';
import { WorkspaceBoardComponent } from './workspace-board/workspace-board.component';

const routes: Routes = [
  { path: 'project/:currentProjectId', component: ProjectBoardComponent },
  { path: 'workspace', component: WorkspaceBoardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardPageRoutingModule {}
