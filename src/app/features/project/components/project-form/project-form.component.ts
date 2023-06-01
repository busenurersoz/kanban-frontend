import { Workspace } from './../../../../core/interfaces/workspace';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Project } from '@core/interfaces/project';
import { ProjectConst } from '@core/constants/project-const';
import { QuillEditorUtil } from '@core/utils/quill';
import { ProjectValidators } from '@core/validators/project-validators';
import {
  ProjectApiActions,
  ProjectPageActions,
} from '@features/project/state/actions';
import { User } from '@core/interfaces/user';

@Component({
  selector: 'project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
})
export class ProjectFormComponent implements OnInit, OnDestroy {
  @Input() currentWorkspace: Workspace;
  @Input() currentProject: Project;
  @Input() editMode: boolean = false;

  currentUser: User = {
    id: '94502aad-c97f-43e1-a9d1-28cf3e4937a7',
    name: 'Busenur Ersöz',
    email: 'busenur@kanban.com',
    avatarUrl: 'assets/user.png',
  };

  private destroy$ = new Subject();
  projectForm: FormGroup;

  defaultEditorOptions = QuillEditorUtil.getDefaultModuleOptions();
  projectCategories = ProjectConst.ProjectCategories;
  isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private projectValidators: ProjectValidators,
    private store: Store<{}>,
    private actionSubject: ActionsSubject,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: [
        '',
        {
          validators: [Validators.required, Validators.minLength(5)],
          asyncValidators: this.projectValidators.uniqueProjectNameValidator(
            this.currentProject,
            this.editMode
          ),
          updateOn: 'blur',
        },
      ],
      key: [
        '',
        {
          validators: [Validators.required, Validators.minLength(2)],
          asyncValidators: this.projectValidators.uniqueProjectKeyValidator(
            this.currentProject,
            this.editMode
          ),
          updateOn: 'blur',
        },
      ],
      url: [],
      category: ['Software Development'],
      description: [],
      leader: [this.currentUser],
      assignees: [[this.currentUser]],
      workspaceId: [this.currentWorkspace?.id],
      workspaceKey: [this.currentWorkspace?.key],
    });

    if (this.editMode) this.projectForm.patchValue(this.currentProject);

    this.actionSubject
      .pipe(
        ofType(
          ProjectApiActions.createProjectSuccess,
          ProjectApiActions.createProjectFailure,
          ProjectApiActions.updateProjectSuccess,
          ProjectApiActions.updateProjectFailure
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isLoading = false;
        this.router.navigateByUrl(
          '/workspaces/' + this.currentWorkspace.id + '/projects'
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm() {
    if (this.projectForm.invalid) {
      return;
    }
    this.isLoading = true;

    if (this.editMode) {
      const projectUpdated: Project = {
        ...this.currentProject,
        ...this.projectForm.getRawValue(),
      };
      this.store.dispatch(
        ProjectPageActions.updateProject({ project: projectUpdated })
      );
    } else {
      const newProject: Project = {
        ...this.projectForm.getRawValue(),
        leader: this.currentUser,
        avatarUrl:
          'https://res.cloudinary.com/comparte/image/upload/v1624858092/viewavatar.svg',
      };
      this.store.dispatch(
        ProjectPageActions.createProject({ project: newProject })
      );
    }
  }

  onCancel(): void {
    this.location.back();
  }
}
