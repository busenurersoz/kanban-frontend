import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/workspaces/all',
  },
  {
    path: 'board',
    loadChildren: () =>
      import('./pages/board/board-page.module').then((m) => m.BoardPageModule),
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./pages/project-pages/project-pages.module').then(
        (m) => m.ProjectPagesModule
      ),
  },
  {
    path: 'workspaces',
    loadChildren: () =>
      import('./pages/workspace-pages/workspace-pages.module').then(
        (m) => m.WorkspacePagesModule
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./pages/error404-page/error404-page.module').then(
        (m) => m.Error404PageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
