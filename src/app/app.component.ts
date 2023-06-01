import {
  getCurrentProject,
  getProjectsByWorkspaceId,
} from '@features/project/state/project.selectors';
import { getCurrentWorkspace } from '@features/workspace/state/workspace.selectors';
import {
  loadIssues,
  loadMeetingIssues,
} from './features/issues/state/actions/issue-page.actions';
import { getWorkspaces } from './features/workspace/state/workspace.selectors';
import { Workspace } from '@core/interfaces/workspace';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';

import { Subject, Observable } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { NavigationService } from '@features/navigation/services/navigation.service';
import { AppState } from '@core/interfaces/app.state';
import { User } from '@core/interfaces/user';
import { getCurrentUser } from '@features/user/state/user.selectors';
import { loadUsers } from '@features/user/state/actions/user.actions';
import {
  loadWorkspaces,
  setCurrentWorkspace,
} from '@features/workspace/state/actions/workspace-page.actions';
import { Router } from '@angular/router';
import {
  loadProjects,
  setCurrentProject,
} from '@features/project/state/actions/project-page.actions';
import { Project } from '@core/interfaces/project';
import { clearAllFilters } from '@features/board/state/filter.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subsNotifier = new Subject();
  workspaces$: Observable<Workspace[]>;
  projects$: Observable<Project[]>;
  currentUser$: Observable<User>;

  currentWorkspace$: Observable<Workspace>;
  currentProject$: Observable<Project>;

  currentWorkspaceId: string;
  currentProjectId: string;

  isSidebarCollapsed = false;
  ready = false;
  constructor(
    private navigationService: NavigationService,
    private store: Store<AppState>,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.navigationService.sidebarCollapseStatusChanged$
      .pipe(takeUntil(this.subsNotifier))
      .subscribe(
        (collapseStatus) => (this.isSidebarCollapsed = collapseStatus)
      );
    this.currentWorkspace$ = this.store.select(getCurrentWorkspace);
    this.currentWorkspace$.subscribe((workspace) => {
      console.log('workspace >> ', workspace);
      this.currentWorkspaceId = workspace?.id;
    });

    const workspaceId = localStorage.getItem('workspaceId');
    if (workspaceId) {
      this.store.dispatch(
        setCurrentWorkspace({
          workspaceId,
        })
      );

      setTimeout(() => {
        this.store.dispatch(loadProjects({ workspaceId }));
        this.projects$ = this.store.select(getProjectsByWorkspaceId);

        const projectId = localStorage.getItem('projectId');
        if (projectId) {
          this.store.dispatch(setCurrentProject({ projectId }));
        }
      }, 200);
    }

    this.store.dispatch(loadWorkspaces());
    this.workspaces$ = this.store.select(getWorkspaces);

    this.store.dispatch(loadUsers());
    this.currentUser$ = this.store.select(getCurrentUser);

    setTimeout(() => {
      this.ready = true;
    }, 100);
  }

  onSidebarCollapsed(sidebarCollapsedStatus: boolean): void {
    this.navigationService.collapseSidebar(sidebarCollapsedStatus);
  }

  ngOnDestroy(): void {
    this.subsNotifier.next();
    this.subsNotifier.complete();
  }
}
