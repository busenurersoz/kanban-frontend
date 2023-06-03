import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/workspaces/all',
      },
      {
        path: 'board',
        loadChildren: () =>
          import('../board/board-page.module').then((m) => m.BoardPageModule),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('../project-pages/project-pages.module').then(
            (m) => m.ProjectPagesModule
          ),
      },
      {
        path: 'workspaces',
        loadChildren: () =>
          import('../workspace-pages/workspace-pages.module').then(
            (m) => m.WorkspacePagesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
