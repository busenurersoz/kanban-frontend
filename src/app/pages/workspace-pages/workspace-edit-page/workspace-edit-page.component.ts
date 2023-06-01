import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Workspace } from '@core/interfaces/workspace';
import { setCurrentWorkspace } from '@features/workspace/state/actions/workspace-page.actions';
import { getWorkspaceById } from '@features/workspace/state/workspace.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-workspace-edit-page',
  templateUrl: './workspace-edit-page.component.html',
  styleUrls: ['./workspace-edit-page.component.scss'],
})
export class WorkspaceEditPageComponent implements OnInit {
  currentWorkspace$: Observable<Workspace>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<{}>,
    private titleService: Title
  ) {
    this.titleService.setTitle(
      'Settings | Details - Kanban Workspace Management'
    );
  }

  ngOnInit(): void {
    this.currentWorkspace$ = this.route.params.pipe(
      switchMap((params: Params) =>
        this.store.select(getWorkspaceById, {
          workspaceId: params.currentWorkspaceId,
        })
      ),
      tap((selectedWorkspace) => {
        if (Boolean(selectedWorkspace))
          this.store.dispatch(
            setCurrentWorkspace({ workspaceId: selectedWorkspace.id })
          );
      })
    );
  }
}
