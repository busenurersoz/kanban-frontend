import { ActivatedRoute, Params } from '@angular/router';
import { Workspace } from '@core/interfaces/workspace';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { tap, filter, switchMap } from 'rxjs/operators';

import { Project } from '@core/interfaces/project';
import {
  getAssignedUsers,
  getCurrentProject,
  getCurrentProjectsByWorkspaceId,
  getProjectById,
} from '@features/project/state/project.selectors';
import { IssuePageActions } from '@features/issues/state/actions';
import { AppState } from '@core/interfaces/app.state';
import { User } from '@core/interfaces/user';
import { getIssuesError } from '@features/issues/state/selectors/issue.selectors';
import { getCurrentWorkspace } from '@features/workspace/state/workspace.selectors';
import { ProjectPageActions } from '@features/project/state/actions';
import { setCurrentProject } from '@features/project/state/actions/project-page.actions';

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.scss'],
})
export class ProjectBoardComponent implements OnInit {
  currentWorkspace$: Observable<Workspace>;
  currentProject$: Observable<Project>;
  assignees$: Observable<User[]>;
  issuesError$: Observable<string>;

  constructor(
    private store: Store<AppState>,
    private titleService: Title,
    private route: ActivatedRoute
  ) {
    this.titleService.setTitle('Project board - Kanban Project Management');
  }

  ngOnInit() {
    this.currentWorkspace$ = this.store.select(getCurrentWorkspace);

    this.route.params.subscribe((params) => {
      if (params.currentProjectId) {
        this.currentProject$ = this.store.select(getProjectById, {
          projectId: params.currentProjectId,
        });

        this.store.dispatch(
          setCurrentProject({ projectId: params.currentProjectId })
        );

        this.store.dispatch(
          IssuePageActions.loadIssues({ projectId: params.currentProjectId })
        );
      }
    });

    // this.currentProjects$ = this.store.select(getCurrentProject).pipe(
    //   filter((project) => Boolean(project)),
    //   tap((project) => {
    //     console.log('project >> ', project);
    //     this.store.dispatch(
    //       IssuePageActions.loadIssues({ projectId: project.id })
    //     );
    //   })
    // );
    this.assignees$ = this.store.select(getAssignedUsers);
    this.issuesError$ = this.store.select(getIssuesError);
  }
}
