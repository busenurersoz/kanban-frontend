import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Workspace } from '@core/interfaces/workspace';
import { WorkspaceService } from '@features/workspace/services/workspace.service';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceValidators {
  constructor(private workspaceService: WorkspaceService) {}

  uniqueWorkspaceNameValidator(
    currentWorkspace: Workspace,
    editMode: boolean
  ): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<ValidationErrors | null>
      | Observable<ValidationErrors | null> => {
      return this.workspaceService.isWorkspaceNameTaken(control.value).pipe(
        map((isTaken) =>
          (isTaken.length &&
            editMode &&
            isTaken[0].id !== currentWorkspace.id) ||
          (isTaken.length && !editMode)
            ? { uniqueProjectName: true }
            : null
        ),
        catchError(() => of(null))
      );
    };
  }

  uniqueWorkspaceKeyValidator(
    currentWorkspace: Workspace,
    editMode: boolean
  ): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<ValidationErrors | null>
      | Observable<ValidationErrors | null> => {
      return this.workspaceService.isWorkspaceKeyTaken(control.value).pipe(
        map((isTaken) =>
          (isTaken.length &&
            editMode &&
            isTaken[0].id !== currentWorkspace.id) ||
          (isTaken.length && !editMode)
            ? { uniqueProjectKey: true }
            : null
        ),
        catchError(() => of(null))
      );
    };
  }
}
