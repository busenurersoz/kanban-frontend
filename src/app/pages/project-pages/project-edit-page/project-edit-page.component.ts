import { getCurrentWorkspace } from './../../../features/workspace/state/workspace.selectors';
import { Workspace } from './../../../core/interfaces/workspace';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

import { Project } from '@core/interfaces/project';
import { getProjectById } from '@features/project/state/project.selectors';
import { setCurrentProject } from '@features/project/state/actions/project-page.actions';

@Component({
  selector: 'app-project-edit-page',
  templateUrl: './project-edit-page.component.html',
  styleUrls: ['./project-edit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectEditPageComponent implements OnInit {
  currentWorkspace: Workspace;
  currentWorkspace$: Observable<Workspace>;
  currentProject$: Observable<Project>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<{}>,
    private titleService: Title
  ) {
    this.titleService.setTitle(
      'Settings | Details - Kanban Project Management'
    );

    this.currentWorkspace$ = this.store.select(getCurrentWorkspace);
    this.currentWorkspace$.subscribe((workspace) => {
      console.log('workspace dddd>> ', workspace);
      this.currentWorkspace = workspace;
    });
  }

  ngOnInit(): void {
    this.currentProject$ = this.route.params.pipe(
      switchMap((params: Params) =>
        this.store.select(getProjectById, { projectId: params.id })
      ),
      tap((selectedProject) => {
        if (Boolean(selectedProject))
          this.store.dispatch(
            setCurrentProject({ projectId: selectedProject.id })
          );
      })
    );
  }
}
