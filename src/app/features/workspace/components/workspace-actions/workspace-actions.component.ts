import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workspace } from '@core/interfaces/workspace';
import {
  WorkspaceApiActions,
  WorkspacePageActions,
} from '@features/workspace/state/actions';
import { setCurrentWorkspace } from '@features/workspace/state/actions/workspace-page.actions';
import { ofType } from '@ngrx/effects';
import { Store, ActionsSubject } from '@ngrx/store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-workspace-actions',
  templateUrl: './workspace-actions.component.html',
  styleUrls: ['./workspace-actions.component.scss'],
})
export class WorkspaceActionsComponent implements OnInit, OnDestroy {
  @Input() workspace: Workspace;

  private destroy$ = new Subject();

  constructor(
    private modalService: NzModalService,
    private store: Store<{}>,
    private actionSubject: ActionsSubject,
    private router: Router
  ) {}

  ngOnInit(): void {
    localStorage.setItem('workspaceId', this.workspace.id);
    this.store.dispatch(
      setCurrentWorkspace({ workspaceId: this.workspace.id })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDeleteWorkspace(): void {
    this.modalService.confirm({
      nzTitle: `Delete ${this.workspace.name}`,
      nzContent:
        "You're about to permanently delete this workspace, its issues, and all of its data.",
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzOnOk: () =>
        new Promise((resolve) => {
          this.actionSubject
            .pipe(
              takeUntil(this.destroy$),
              ofType(
                WorkspaceApiActions.deleteWorkspaceSuccess,
                WorkspaceApiActions.deleteWorkspaceFailure
              )
            )
            .subscribe((_) => {
              resolve();
            });

          this.store.dispatch(
            WorkspacePageActions.deleteWorkspace({
              workspaceId: this.workspace.id,
            })
          );
        }),
    });
  }

  doAction() {
    this.router.navigateByUrl(
      '/workspaces/' + this.workspace.id + '/settings/details'
    );
  }

  changeCurrentWorkspace(workspaceId: string): void {}
}
