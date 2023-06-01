import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardKanbanComponent } from '@features/board/components/board-kanban/board-kanban.component';
import { ProjectFormComponent } from '@features/project/components/project-form/project-form.component';
import { ProjectCreatePageComponent } from '../project-pages/project-create-page/project-create-page.component';
import { WorkspaceBoardPageComponent } from './workspace-board-page/workspace-board-page.component';
import { WorkspaceCreatePageComponent } from './workspace-create-page/workspace-create-page.component';
import { WorkspaceEditPageComponent } from './workspace-edit-page/workspace-edit-page.component';
import { WorkspaceListPageComponent } from './workspace-list-page/workspace-list-page.component';
import { WorkspaceProjectsListPageComponent } from './workspace-projects-list-page/workspace-projects-list-page.component';

const routes: Routes = [
  { path: 'all', component: WorkspaceListPageComponent },
  { path: 'new', component: WorkspaceCreatePageComponent },
  {
    path: ':currentWorkspaceId/settings/details',
    component: WorkspaceEditPageComponent,
  },
  { path: 'myWorkspace', component: WorkspaceBoardPageComponent },
  {
    path: ':currentWorkspaceId/projects',
    component: WorkspaceProjectsListPageComponent,
  },
  {
    path: ':currentWorkspaceId/projects/:currentProjectId/board',
    component: BoardKanbanComponent,
  },
  {
    path: ':currentWorkspaceId/projects/new',
    component: ProjectCreatePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspacePagesRoutingModule {}
