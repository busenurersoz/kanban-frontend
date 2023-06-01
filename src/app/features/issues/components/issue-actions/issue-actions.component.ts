import {
  loadMeetingIssues,
  loadUpcommingIssues,
} from './../../state/actions/issue-page.actions';
import { loadIssues } from '@features/issues/state/actions/issue-page.actions';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NzModalService } from 'ng-zorro-antd/modal';

import { Issue } from '@core/interfaces/issue';
import { AppState } from '@core/interfaces/app.state';
import {
  IssueApiActions,
  IssuePageActions,
} from '@features/issues/state/actions';
import { IssueCreateModalComponent } from '../issue-create-modal/issue-create-modal.component';

@Component({
  selector: 'issue-actions',
  templateUrl: './issue-actions.component.html',
  styleUrls: ['./issue-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueActionsComponent implements OnDestroy {
  @Input() issue: Issue;
  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();

  private destroy$ = new Subject();

  constructor(
    private modalService: NzModalService,
    private store: Store<AppState>,
    private actionSubject: ActionsSubject
  ) {}

  onDeleteIssue(templContent: TemplateRef<{}>): void {
    this.modalService.confirm({
      nzTitle: `Delete ${this.issue.projectKey}-${this.issue.key}`,
      nzContent: templContent,
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzOnOk: () =>
        new Promise((resolve) => {
          this.actionSubject
            .pipe(
              takeUntil(this.destroy$),
              ofType(
                IssueApiActions.deleteIssueSuccess,
                IssueApiActions.deleteIssueFailure
              )
            )
            .subscribe((_) => {
              this.delete.next();
              this.store.dispatch(loadMeetingIssues());
              this.store.dispatch(loadUpcommingIssues());
              resolve();
            });

          this.store.dispatch(
            IssuePageActions.deleteIssue({ issueId: this.issue.id })
          );
        }),
    });
  }

  onEditIssue() {
    this.modalService.create({
      nzTitle: 'Edit Issue',
      nzContent: IssueCreateModalComponent,
      nzFooter: null,
      nzKeyboard: false,
      nzMaskClosable: false,
      nzWidth: 700,
      nzComponentParams: {
        issue: this.issue,
      },
    });

    this.delete.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
