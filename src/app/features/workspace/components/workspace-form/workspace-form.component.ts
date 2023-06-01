import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@core/interfaces/user';
import { Workspace } from '@core/interfaces/workspace';
import { QuillEditorUtil } from '@core/utils/quill';
import {
  WorkspaceApiActions,
  WorkspacePageActions,
} from '@features/workspace/state/actions';
import { ofType } from '@ngrx/effects';
import { Store, ActionsSubject } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { WorkspaceValidators } from '@core/validators/workspace-validators';

@Component({
  selector: 'app-workspace-form',
  templateUrl: './workspace-form.component.html',
  styleUrls: ['./workspace-form.component.scss'],
})
export class WorkspaceFormComponent implements OnInit {
  @Input() currentWorkspace: Workspace;
  currentUser: User = {
    id: '94502aad-c97f-43e1-a9d1-28cf3e4937a7',
    name: 'Busenur Ersöz',
    email: 'usenur@kanban.com',
    avatarUrl: 'assets/user.png',
  };
  @Input() editMode: boolean = false;
  private destroy$ = new Subject();

  workspaceForm: FormGroup;

  defaultEditorOptions = QuillEditorUtil.getDefaultModuleOptions();
  //  workspaceCategories = workspaceConst.ProjectCategories;
  isLoading: boolean;
  openAccess = true;

  items = [
    {
      label: 'Public',
      checked: true,
      value: true,
    },
    {
      label: 'Private',
      checked: false,
      value: false,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private workspaceValidators: WorkspaceValidators,
    private store: Store<{}>,
    private actionSubject: ActionsSubject,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.workspaceForm = this.fb.group({
      name: [
        '',
        {
          validators: [Validators.required, Validators.minLength(5)],
          asyncValidators:
            this.workspaceValidators.uniqueWorkspaceNameValidator(
              this.currentWorkspace,
              this.editMode
            ),
          updateOn: 'blur',
        },
      ],
      key: [
        '',
        {
          validators: [Validators.required, Validators.minLength(2)],
          asyncValidators: this.workspaceValidators.uniqueWorkspaceKeyValidator(
            this.currentWorkspace,
            this.editMode
          ),
          updateOn: 'blur',
        },
      ],
      openAccess: [true],
      description: [],
    });

    if (this.editMode) {
      this.workspaceForm.patchValue(this.currentWorkspace);
      this.openAccess = this.workspaceForm.controls['openAccess'].value;
    }

    this.actionSubject
      .pipe(
        ofType(
          WorkspaceApiActions.createWorkspaceSuccess,
          WorkspaceApiActions.createWorkspaceFailure,
          WorkspaceApiActions.updateWorkspaceSuccess,
          WorkspaceApiActions.updateWorkspaceFailure
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isLoading = false;
        this.router.navigateByUrl('/workspaces/all');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm() {
    if (this.workspaceForm.invalid) {
      return;
    }
    this.isLoading = true;

    if (this.editMode) {
      const workspaceUpdated: Workspace = {
        ...this.currentWorkspace,
        ...this.workspaceForm.getRawValue(),
      };
      this.store.dispatch(
        WorkspacePageActions.updateWorkspace({ workspace: workspaceUpdated })
      );
    } else {
      const newWorkspace: Workspace = {
        ...this.workspaceForm.getRawValue(),
        leader: this.currentUser,
        avatarUrl:
          'https://res.cloudinary.com/comparte/image/upload/v1624858092/viewavatar.svg',
      };
      this.store.dispatch(
        WorkspacePageActions.createWorkspace({ workspace: newWorkspace })
      );
    }
  }

  onCancel(): void {
    this.location.back();
  }
}
