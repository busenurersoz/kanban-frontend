import { Workspace } from '@core/interfaces/workspace';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { WorkspaceState } from './workspace.reducer';

const getWorkspaceFeatureState =
  createFeatureSelector<WorkspaceState>('workspace');

// Selectors
export const getCurrentWorkspaceId = createSelector(
  getWorkspaceFeatureState,
  (state) => state.currentWorkspaceId
);

// Compound selector
export const getCurrentWorkspace = createSelector(
  getWorkspaceFeatureState,
  getCurrentWorkspaceId,
  (state, currentWorkspaceId) => {
    return state.workspaces.find((p) => p.id === currentWorkspaceId);
  }
);

export const isCurrentWorkspace = createSelector(
  getWorkspaceFeatureState,
  getCurrentWorkspaceId,
  (state, currentWorkspaceId) => {
    return !!state.workspaces.find((p) => p.id === currentWorkspaceId);
  }
);

export const getWorkspaces = createSelector(
  getWorkspaceFeatureState,
  (state) => state?.workspaces
);

export const getWorkspaceById = createSelector(
  getWorkspaces,
  (workspaces: Workspace[], props: { workspaceId: string }) =>
    workspaces.find((p) => p.id === props.workspaceId)
);

export const getCurrentWorkspaceKey = createSelector(
  getWorkspaceFeatureState,
  getCurrentWorkspace,
  (_, currentWorkspace) => {
    return currentWorkspace.key;
  }
);

export const getWorkspaceError = createSelector(
  getWorkspaceFeatureState,
  (state) => state.error
);
