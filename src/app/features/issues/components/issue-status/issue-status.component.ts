import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { take } from 'rxjs/operators';

import { Issue, IssueStatus, IssueStatusDisplay } from '@core/interfaces/issue';
import { AppState } from '@core/interfaces/app.state';
import { IssuePageActions } from '@features/issues/state/actions';
import { getIssuesCountByStatus } from '@features/issues/state/selectors/issue.selectors';

@Component({
  selector: 'issue-status',
  templateUrl: './issue-status.component.html',
  styleUrls: ['./issue-status.component.scss'],
})
export class IssueStatusComponent implements OnInit {
  @Input() issue: Issue;

  statusFeedback = {
    [IssueStatus.BACKLOG]: 'btn btn-backlog',
    [IssueStatus.IN_PROGRESS]: 'btn btn-progress ',
    [IssueStatus.TEST]: 'btn btn-test',
    [IssueStatus.IN_REVIEW]: 'btn btn-in-review',
    [IssueStatus.DONE]: 'btn btn-done',
  };

  issueStatuses: IssueStatusValueLabel[];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    console.log();
    this.issueStatuses = [
      new IssueStatusValueLabel(IssueStatus.BACKLOG),
      new IssueStatusValueLabel(IssueStatus.IN_PROGRESS),
      new IssueStatusValueLabel(IssueStatus.TEST),
      new IssueStatusValueLabel(IssueStatus.IN_REVIEW),
      new IssueStatusValueLabel(IssueStatus.DONE),
    ];
  }

  updateIssue(status: IssueStatus) {
    this.issue = { ...this.issue, status };
    this.store
      .select(getIssuesCountByStatus, { status })
      .pipe(take(1))
      .subscribe((issueCount) => {
        this.store.dispatch(
          IssuePageActions.updateIssue({
            issue: {
              ...this.issue,
              status,
              listPosition: issueCount,
            },
          })
        );
      });
  }

  isStatusSelected(status: IssueStatus) {
    return this.issue.status === status;
  }
}

class IssueStatusValueLabel {
  value: IssueStatus;
  label: string;
  constructor(issueStatus: IssueStatus) {
    this.value = issueStatus;
    this.label = IssueStatusDisplay[issueStatus];
  }
}
