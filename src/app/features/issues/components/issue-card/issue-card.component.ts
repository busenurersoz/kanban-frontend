import { getUpcomingIssuesById } from './../../state/selectors/issue.selectors';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';

import { NzModalService } from 'ng-zorro-antd/modal';

import { Issue } from '@core/interfaces/issue';
import { AppState } from '@core/interfaces/app.state';
import { IssueUtil } from '@core/utils/issue';
import { IssueDetailModalComponent } from '../issue-detail-modal/issue-detail-modal.component';
import {
  getIssueById,
  getMeetingIssueById,
} from '@features/issues/state/selectors/issue.selectors';
import { CommentPageActions } from '@features/issues/state/actions';
import { getAssignedUsers } from '@features/project/state/project.selectors';

@Component({
  selector: 'app-issue-card',
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueCardComponent implements OnInit {
  @Input() isMeeting = false;
  @Input() isUpcoming = false;
  @Input() issue: Issue;
  issueTypeIcon: Observable<string>;
  priorityIcon: Observable<string>;

  constructor(
    private store: Store<AppState>,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.issueTypeIcon = of(IssueUtil.getIssueTypeIcon(this.issue.type));
    this.priorityIcon = of(IssueUtil.getIssuePriorityIcon(this.issue.priority));
  }

  openIssueDetailModal(issueId: string): void {
    this.store.dispatch(CommentPageActions.loadCommentsByIssueId({ issueId }));
    const modalConfig = {
      nzContent: IssueDetailModalComponent,
      nzWidth: 1280,
      nzClosable: false,
      nzFooter: null,
      nzComponentParams: {
        issue$: this.store.select(getIssueById, { issueId }),
        assignees$: this.store.select(getAssignedUsers),
      },
    };

    if (this.isMeeting) {
      modalConfig.nzComponentParams['issue$'] = this.store.select(
        getMeetingIssueById,
        { issueId }
      );
    } else if (this.isUpcoming) {
      modalConfig.nzComponentParams['issue$'] = this.store.select(
        getUpcomingIssuesById,
        { issueId }
      );
    } else {
      modalConfig.nzComponentParams['issue$'] = this.store.select(
        getIssueById,
        { issueId }
      );
    }

    this.modalService.create(modalConfig);
  }
}
