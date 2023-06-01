import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { getCurrentUser } from '@features/user/state/user.selectors';
import { User } from '@core/interfaces/user';
import { Workspace } from '@core/interfaces/workspace';
import { getCurrentWorkspace } from '@features/workspace/state/workspace.selectors';

@Component({
  selector: 'app-project-create-page',
  templateUrl: './project-create-page.component.html',
  styleUrls: ['./project-create-page.component.scss'],
})
export class ProjectCreatePageComponent implements OnInit {
  currentUser$: Observable<User>;
  currentWorkspace: Workspace;
  currentWorkspace$: Observable<Workspace>;

  constructor(private store: Store<{}>, private titleService: Title) {}

  ngOnInit(): void {
    // this.currentUser$ = this.store.select(getCurrentUser)
    //   .pipe(filter(user => Boolean(user)));
    this.titleService.setTitle('Create project - Kanban Project Management');

    this.currentWorkspace$ = this.store.select(getCurrentWorkspace);
    this.currentWorkspace$.subscribe((workspace) => {
      this.currentWorkspace = workspace;
    });
  }
}
