import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { Observable, Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { NzModalRef } from 'ng-zorro-antd/modal';

import { AppState } from '@core/interfaces/app.state';
import {
  getAssignedUsers,
  getCurrentProjectId,
} from '@features/project/state/project.selectors';
import { User } from '@core/interfaces/user';
import { getCurrentUser } from '@features/user/state/user.selectors';
import { Issue, IssuePriority, IssueStatus } from '@core/interfaces/issue';
import {
  IssueApiActions,
  IssuePageActions,
} from '@features/issues/state/actions';
import { QuillEditorUtil } from '@core/utils/quill';
import { getCurrentProjectKey } from '@features/project/state/project.selectors';

@Component({
  selector: 'app-issue-create-modal',
  templateUrl: './issue-create-modal.component.html',
  styleUrls: ['./issue-create-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueCreateModalComponent implements OnInit, OnDestroy {
  @Input() issue: Issue;
  private destroy$ = new Subject();
  issueForm: FormGroup;

  users$: Observable<User[]>;
  currentProjectId: string;
  currentProjectKey: string;
  currentUser: User;

  editorOptions = QuillEditorUtil.getModuleOptionsWithMedia();
  isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modalRef: NzModalRef,
    private actionSubject: ActionsSubject
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.initForm(this.issue);

    this.actionSubject
      .pipe(
        skip(1),
        ofType(
          IssueApiActions.createIssueSuccess,
          IssueApiActions.createIssueFailure,
          IssueApiActions.updateIssueSuccess,
          IssueApiActions.updateIssueFailure
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isLoading = false;
        this.closeModal();
      });
  }

  submitForm() {
    if (this.issueForm.invalid) {
      return;
    }
    this.isLoading = true;

    const issue: Issue = {
      ...this.issueForm.getRawValue(),
      listPosition: 0,
      status: IssueStatus.BACKLOG,
    };

    if (issue?.id) {
      this.store.dispatch(IssuePageActions.updateIssue({ issue }));
    } else {
      this.store.dispatch(IssuePageActions.createIssue({ issue }));
    }
  }

  private loadData(): void {
    this.users$ = this.store.select(getAssignedUsers);

    this.store
      .select(getCurrentProjectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((projectId) => (this.currentProjectId = projectId));

    this.store
      .select(getCurrentProjectKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe((projectKey) => (this.currentProjectKey = projectKey));

    this.store
      .select(getCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.currentUser = user));
  }

  private initForm(issue?: Issue): void {
    this.issueForm = this.fb.group({
      id: [this.issue?.id],
      projectId: [this.issue?.projectId ?? this.currentProjectId],
      projectKey: [this.issue?.projectKey ?? this.currentProjectKey],
      type: [this.issue?.type ?? 'Story', Validators.required],
      priority: [
        this.issue?.priority ?? IssuePriority.MEDIUM,
        Validators.required,
      ],
      title: [
        this.issue?.title ?? '',
        [Validators.required, Validators.minLength(5)],
      ],
      description: [this.issue?.description ?? ''],
      reporter: [this.currentUser, Validators.required],
      assignees: [this.issue?.assignees ?? []],
      deadline: [this.issue?.deadline ?? new Date()],
    });
  }

  closeModal(): void {
    this.modalRef.destroy();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
