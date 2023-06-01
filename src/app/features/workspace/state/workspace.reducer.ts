import { Workspace } from '@core/interfaces/workspace';
import { createReducer, on } from '@ngrx/store';

import { WorkspaceApiActions, WorkspacePageActions } from './actions';

export interface WorkspaceState {
  currentWorkspaceId: string | null;
  workspaces: Workspace[];
  error: string;
}

const initialState: WorkspaceState = {
  currentWorkspaceId: '611e1977bd926c6f3877a0f5',
  workspaces: [],
  error: null,
};

export const workspaceReducer = createReducer<WorkspaceState>(
  initialState,
  on(
    WorkspacePageActions.setCurrentWorkspace,
    (state, action): WorkspaceState => {
      return {
        ...state,
        currentWorkspaceId: action.workspaceId,
      };
    }
  ),
  on(
    WorkspaceApiActions.loadWorkspacesSuccess,
    (state, action): WorkspaceState => {
      return {
        ...state,
        workspaces: action.workspaces,
        error: null,
      };
    }
  ),
  on(
    WorkspaceApiActions.loadWorkspacesFailure,
    (state, action): WorkspaceState => {
      return {
        ...state,
        error: action.error,
      };
    }
  ),
  on(
    WorkspaceApiActions.createWorkspaceSuccess,
    (state, action): WorkspaceState => {
      return {
        ...state,
        workspaces: [...state.workspaces, action.workspace],
      };
    }
  ),
  on(
    WorkspaceApiActions.updateWorkspaceSuccess,
    (state, action): WorkspaceState => {
      const updatedWorkspaces = state.workspaces.map((workspace) =>
        action.workspace.id === workspace.id ? action.workspace : workspace
      );
      return {
        ...state,
        workspaces: updatedWorkspaces,
      };
    }
  ),

  on(
    WorkspaceApiActions.deleteWorkspaceSuccess,
    (state, action): WorkspaceState => {
      const updatedWorkspaces = state.workspaces.filter(
        (p) => p.id !== action.workspaceId
      );
      return {
        ...state,
        workspaces: updatedWorkspaces,
      };
    }
  )
);
