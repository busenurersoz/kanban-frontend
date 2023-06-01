import { Workspace } from '@core/interfaces/workspace';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

import { Project } from '@core/interfaces/project';
import {
  getAssignedUsers,
  getCurrentProject,
  getCurrentProjectsByWorkspaceId,
} from '@features/project/state/project.selectors';
import { IssuePageActions } from '@features/issues/state/actions';
import { AppState } from '@core/interfaces/app.state';
import { User } from '@core/interfaces/user';
import { getIssuesError } from '@features/issues/state/selectors/issue.selectors';
import { getCurrentWorkspace } from '@features/workspace/state/workspace.selectors';
import { ProjectPageActions } from '@features/project/state/actions';
import { IssueStatus } from '@core/interfaces/issue';

@Component({
  selector: 'app-workspace-board',
  templateUrl: './workspace-board.component.html',
  styleUrls: ['./workspace-board.component.scss'],
})
export class WorkspaceBoardComponent implements OnInit {
  currentWorkspace$: Observable<Workspace>;
  currentProjects$: Observable<Project>;
  assignees$: Observable<User[]>;
  issuesError$: Observable<string>;

  issuesStatuses: IssueStatus[] = [
    IssueStatus.BACKLOG,
    IssueStatus.IN_PROGRESS,
    IssueStatus.IN_REVIEW,
    IssueStatus.DONE,
  ];

  constructor(private store: Store<AppState>, private titleService: Title) {
    this.titleService.setTitle('Project board - Kanban Project Management');
  }

  ngOnInit() {
    this.currentWorkspace$ = this.store.select(getCurrentWorkspace).pipe(
      filter((workspace) => Boolean(workspace)),
      tap(
        (workspace) =>
          this.store.dispatch(
            ProjectPageActions.loadProjects({ workspaceId: workspace.id })
          )
        // tap(workspace => this.store.dispatch(IssuePageActions.loadIssues({ workspaceId: workspace.id }))
      )
    );

    this.currentWorkspace$.subscribe((result) => {
      console.log('result >> ', result);
    });

    this.currentProjects$ = this.store.select(getCurrentProjectsByWorkspaceId);
    // this.assignees$ = this.store.select(getAssignedUsers);
    // this.issuesError$ = this.store.select(getIssuesError);
  }
}
