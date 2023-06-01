import { loadIssues } from './../../../features/issues/state/actions/issue-page.actions';
import { Project } from './../../../core/interfaces/project';
import { getCurrentWorkspace } from './../../../features/workspace/state/workspace.selectors';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Workspace } from '@core/interfaces/workspace';
import { Store } from '@ngrx/store';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import {
  getCurrentProjectsByWorkspaceId,
  getProjectsByWorkspaceId,
  getProjectsByWorkspaceId2,
  getProjectsError,
} from '@features/project/state/project.selectors';
import * as fromFilterActions from '@features/board/state/filter.actions';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  loadProjects,
  setCurrentProject,
} from '@features/project/state/actions/project-page.actions';
import { setCurrentWorkspace } from '@features/workspace/state/actions/workspace-page.actions';

@Component({
  selector: 'app-workspace-projects-list-page',
  templateUrl: './workspace-projects-list-page.component.html',
  styleUrls: ['./workspace-projects-list-page.component.scss'],
})
export class WorkspaceProjectsListPageComponent implements OnInit {
  private destroy$ = new Subject();
  currentWorkspace: Workspace;
  projects: Project[];
  projects$: Observable<Project[]>;
  projectsError$: Observable<string>;

  projectsForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<{}>,
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute
  ) {
    this.titleService.setTitle('Projects -  Project Management Tool');
  }

  ngOnInit(): void {
    this.projectsForm = this.fb.group({
      search: [null],
    });

    this.route.params.subscribe((params) => {
      if (params.currentWorkspaceId) {
        this.changeCurrentWorkspace(params.currentWorkspaceId);
      }
    });
  }

  changeCurrentWorkspace(workspaceId: string): void {
    this.store.dispatch(setCurrentWorkspace({ workspaceId }));

    this.store.dispatch(loadProjects({ workspaceId }));
    this.store.dispatch(fromFilterActions.clearAllFilters());

    this.store
      .select(getCurrentWorkspace)
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentWorkspace) => {
        this.currentWorkspace = currentWorkspace;
      });

    this.projectsError$ = this.store.select(getProjectsError);
    this.projects$ = this.store
      .select(getProjectsByWorkspaceId2)
      .pipe(
        map((issues) =>
          [...issues].filter((issue) => issue.workspaceId === workspaceId)
        )
      );
  }

  sortByNameFn(a: Project, b: Project): number {
    return a.name.localeCompare(b.name);
  }

  sortByKeyFn(a: Project, b: Project): number {
    return a.key.localeCompare(b.key);
  }

  sortByLeaderFn(a: Project, b: Project): number {
    return a.leader.name.localeCompare(b.leader.name);
  }

  changeCurrentProject(projectId: string): void {
    localStorage.setItem('projectId', projectId);
    this.store.dispatch(setCurrentProject({ projectId }));
    this.store.dispatch(fromFilterActions.clearAllFilters());
    this.store.dispatch(loadIssues({ projectId }));
  }

  goToProjectBoard(projectId: string) {
    this.changeCurrentProject(projectId);
    this.router.navigateByUrl('board/project/' + projectId);
  }

  goToBoard(projectId: string) {
    this.changeCurrentProject(projectId);
    this.router.navigateByUrl(
      'workspaces/' +
        this.currentWorkspace.id +
        '/projects/' +
        projectId +
        '/board'
    );
  }
}
