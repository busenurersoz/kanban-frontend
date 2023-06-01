import { setCurrentWorkspace } from '@features/workspace/state/actions/workspace-page.actions';
import { Workspace } from '@core/interfaces/workspace';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { getProjectsError } from '@features/project/state/project.selectors';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { getWorkspaces } from '@features/workspace/state/workspace.selectors';
import * as fromFilterActions from '@features/board/state/filter.actions';
import { loadProjects } from '@features/project/state/actions/project-page.actions';

@Component({
  selector: 'app-workspace-list-page',
  templateUrl: './workspace-list-page.component.html',
  styleUrls: ['./workspace-list-page.component.scss'],
})
export class WorkspaceListPageComponent implements OnInit {
  workspaces$: Observable<Workspace[]>;
  workspacesForm!: FormGroup;
  workspacesError$: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private store: Store<{}>,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle('All workspaces - Kanban Project Management');
  }

  ngOnInit(): void {
    this.workspacesForm = this.fb.group({
      search: [null],
    });

    this.workspaces$ = combineLatest([
      this.store.select(getWorkspaces),
      this.workspacesForm.valueChanges.pipe(startWith({ search: '' })),
    ]).pipe(
      switchMap(([workspaces, term]) => {
        const searchTerm = term.search as string;
        return of(
          workspaces?.filter((w) =>
            Boolean(searchTerm)
              ? w.name.toLowerCase().includes(searchTerm.toLowerCase())
              : true
          )
        );
      })
    );
    this.workspacesError$ = this.store.select(getProjectsError);
  }

  sortByNameFn(a: Workspace, b: Workspace): number {
    return a.name.localeCompare(b.name);
  }

  sortByKeyFn(a: Workspace, b: Workspace): number {
    return a.key.localeCompare(b.key);
  }

  // sortByLeaderFn(a: Workspace, b: Workspace): number {
  //   return a.leader.name.localeCompare(b.leader.name);
  // }

  changeCurrentWorkspace(workspaceId: string): void {
    localStorage.setItem('workspaceId', workspaceId);

    this.store.dispatch(setCurrentWorkspace({ workspaceId }));

    this.store.dispatch(loadProjects({ workspaceId }));
    this.store.dispatch(fromFilterActions.clearAllFilters());
  }

  gotToProjects(workspaceId: string) {
    this.changeCurrentWorkspace(workspaceId);
    this.router.navigateByUrl('workspaces/' + workspaceId + '/projects');
  }

  goToBoard(workspaceId: string): void {
    this.changeCurrentWorkspace(workspaceId);
    this.router.navigateByUrl('workspaces/' + workspaceId + '/board');
  }
}
