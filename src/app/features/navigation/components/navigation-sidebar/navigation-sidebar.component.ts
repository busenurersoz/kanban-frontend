import { Workspace } from './../../../../core/interfaces/workspace';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { NavigationService } from '@features/navigation/services/navigation.service';
import { Project } from '@core/interfaces/project';
import {
  getCurrentProject,
  getProjectsByWorkspaceId2,
  getProjectsError,
} from '@features/project/state/project.selectors';
import { Router, ActivatedRoute } from '@angular/router';
import { setCurrentWorkspace } from '@features/workspace/state/actions/workspace-page.actions';
import * as fromFilterActions from '@features/board/state/filter.actions';
import { getCurrentWorkspace } from '@features/workspace/state/workspace.selectors';
import { loadProjects } from '@features/project/state/actions/project-page.actions';

@Component({
  selector: 'app-navigation-sidebar',
  templateUrl: './navigation-sidebar.component.html',
  styleUrls: ['./navigation-sidebar.component.scss'],
})
export class NavigationSidebarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  currentWorkspace: Workspace;
  currentProject: Project;
  @Input() workspaces$: Observable<Workspace[]>;
  @Input() projects$: Observable<Project[]>;

  isCollapsed = false;

  constructor(
    private navigationService: NavigationService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const params = this.route.params.subscribe((params) => {
      if (params.currentWorkspaceId) {
        this.changeCurrentWorkspace(params.currentWorkspaceId);
      }
    });
  }

  ngOnInit(): void {
    this.navigationService.sidebarCollapseStatusChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((collapseStatus) => (this.isCollapsed = collapseStatus));
    this.store
      .select(getCurrentWorkspace)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (currentWorkspace) => (this.currentWorkspace = currentWorkspace)
      );
    this.store
      .select(getCurrentProject)
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentProject) => (this.currentProject = currentProject));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeCurrentWorkspace(workspaceId: string): void {
    localStorage.setItem('workspaceId', workspaceId);

    this.store.dispatch(setCurrentWorkspace({ workspaceId }));

    this.store.dispatch(loadProjects({ workspaceId }));
    this.store.dispatch(fromFilterActions.clearAllFilters());

    this.store
      .select(getCurrentWorkspace)
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentWorkspace) => {
        this.currentWorkspace = currentWorkspace;
      });

    // this.projectsError$ = this.store.select(getProjectsError);
    this.projects$ = this.store
      .select(getProjectsByWorkspaceId2, { workspaceId })
      .pipe(
        map((issues) =>
          [...issues].filter((issue) => issue.workspaceId === workspaceId)
        )
      );

    this.router.navigateByUrl(
      'workspaces/' + this.currentWorkspace.id + '/projects'
    );
  }
  goToProject(project) {
    this.router.navigateByUrl('/board/project/' + project.id);
  }
}
