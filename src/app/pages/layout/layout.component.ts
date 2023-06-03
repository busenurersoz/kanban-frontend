import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@core/interfaces/app.state';
import { Project } from '@core/interfaces/project';
import { User } from '@core/interfaces/user';
import { Workspace } from '@core/interfaces/workspace';
import { NavigationService } from '@features/navigation/services/navigation.service';
import {
  loadProjects,
  setCurrentProject,
} from '@features/project/state/actions/project-page.actions';
import { getProjectsByWorkspaceId } from '@features/project/state/project.selectors';
import { loadUsers } from '@features/user/state/actions/user.actions';
import { getCurrentUser } from '@features/user/state/user.selectors';
import {
  setCurrentWorkspace,
  loadWorkspaces,
} from '@features/workspace/state/actions/workspace-page.actions';
import {
  getCurrentWorkspace,
  getWorkspaces,
} from '@features/workspace/state/workspace.selectors';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
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
    public router: Router,
    private authService: AuthService
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
