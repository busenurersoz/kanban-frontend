import { Workspace } from '@core/interfaces/workspace';
import { createAction, props } from '@ngrx/store';

export const setCurrentWorkspace = createAction(
  '[Workspace Page] Set Current Workspace',
  props<{ workspaceId: string }>()
);

export const loadWorkspaces = createAction('[Workspace Page] Load Workspaces');

export const createWorkspace = createAction(
  '[Workspace Page] Create Workspace',
  props<{ workspace: Workspace }>()
);

export const updateWorkspace = createAction(
  '[Workspace Page] Update Workspace',
  props<{ workspace: Workspace }>()
);

export const deleteWorkspace = createAction(
  '[Workspace Page] Delete Workspace',
  props<{ workspaceId: string }>()
);
