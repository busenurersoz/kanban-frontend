import { getCurrentProject } from '@features/project/state/project.selectors';
import { Component, Input, OnInit } from '@angular/core';
import { Project } from '@core/interfaces/project';
import { Workspace } from '@core/interfaces/workspace';
import { getCurrentWorkspace } from '@features/workspace/state/workspace.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-workspace-header',
  templateUrl: './workspace-header.component.html',
  styleUrls: ['./workspace-header.component.scss'],
})
export class WorkspaceHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() subTitle: string;
  currentWorkspace$: Observable<Workspace>;
  currentProject$: Observable<Project>;

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    this.currentWorkspace$ = this.store
      .select(getCurrentWorkspace)
      .pipe(filter((workspace) => Boolean(workspace)));

    this.currentProject$ = this.store
      .select(getCurrentProject)
      .pipe(filter((project) => Boolean(project)));
  }
}
