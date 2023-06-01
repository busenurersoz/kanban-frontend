import { isCurrentWorkspace } from './../../../workspace/state/workspace.selectors';
import { Workspace } from '@core/interfaces/workspace';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NzModalService } from 'ng-zorro-antd/modal';

import { NavigationService } from '@features/navigation/services/navigation.service';
import { Project } from '@core/interfaces/project';
import { AppState } from '@core/interfaces/app.state';
import { setCurrentProject } from '@features/project/state/actions/project-page.actions';
import { IssueCreateModalComponent } from '@features/issues/components/issue-create-modal/issue-create-modal.component';
import { User } from '@core/interfaces/user';
import { isCurrentProject } from '@features/project/state/project.selectors';
import * as fromFilterActions from '@features/board/state/filter.actions';
import { setCurrentWorkspace } from '@features/workspace/state/actions/workspace-page.actions';
import { loadIssues } from '@features/issues/state/actions/issue-page.actions';

@Component({
  selector: 'app-navigation-toolbar',
  templateUrl: './navigation-toolbar.component.html',
  styleUrls: ['./navigation-toolbar.component.scss'],
})
export class NavigationToolbarComponent implements OnInit, OnDestroy {
  @Input() workspaces$: Observable<Workspace[]>;
  @Input() projects$: Observable<Project[]>;
  @Input() currentUser: User;
  isCurrentWorkspace$: Observable<boolean>;

  private destroy$ = new Subject();

  isSidebarCollapsed = false;

  constructor(
    private navigationService: NavigationService,
    private store: Store<AppState>,
    private modalService: NzModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.navigationService.sidebarCollapseStatusChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (collapseStatus) => (this.isSidebarCollapsed = collapseStatus)
      );

    this.isCurrentWorkspace$ = this.store.select(isCurrentWorkspace);
  }

  onCollapseSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.navigationService.collapseSidebar(this.isSidebarCollapsed);
  }

  changeCurrentWorkspace(workspaceId: string): void {
    this.store.dispatch(setCurrentWorkspace({ workspaceId }));
    this.store.dispatch(fromFilterActions.clearAllFilters());
    this.router.navigateByUrl('workspaces/' + workspaceId + '/projects');
  }

  changeCurrentProject(projectId: string): void {
    this.store.dispatch(setCurrentProject({ projectId }));
    this.store.dispatch(loadIssues({ projectId }));
    this.store.dispatch(fromFilterActions.clearAllFilters());
    this.router.navigateByUrl('board/project/' + projectId);
  }

  openCreateIssueModal() {
    this.modalService.create({
      nzTitle: 'Create Issue',
      nzContent: IssueCreateModalComponent,
      nzFooter: null,
      nzKeyboard: false,
      nzMaskClosable: false,
      nzWidth: 700,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
