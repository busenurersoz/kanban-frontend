import { Workspace } from '@core/interfaces/workspace';
import { createAction, props } from '@ngrx/store';

export const loadWorkspacesSuccess = createAction(
  '[Workspace API] Load Success',
  props<{ workspaces: Workspace[] }>()
);
export const loadWorkspacesFailure = createAction(
  '[Workspace API] Load Fail',
  props<{ error: string }>()
);

export const createWorkspaceSuccess = createAction(
  '[Workspace API] Create Workspace Success',
  props<{ workspace: Workspace }>()
);
export const createWorkspaceFailure = createAction(
  '[Workspace API] Create Workspace Fail',
  props<{ error: string }>()
);

export const updateWorkspaceSuccess = createAction(
  '[Workspace API] Update Workspace Success',
  props<{ workspace: Workspace }>()
);
export const updateWorkspaceFailure = createAction(
  '[Workspace API] Update Workspace Fail',
  props<{ error: string }>()
);

export const deleteWorkspaceSuccess = createAction(
  '[Workspace API] Delete Workspace Success',
  props<{ workspaceId: string }>()
);
export const deleteWorkspaceFailure = createAction(
  '[Workspace API] Delete Workspace Fail',
  props<{ error: string }>()
);
