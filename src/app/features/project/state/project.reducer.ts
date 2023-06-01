import { createReducer, on } from '@ngrx/store';

import { Project } from '@core/interfaces/project';
import { ProjectPageActions, ProjectApiActions } from './actions';

export interface ProjectState {
  currentWorkspaceId: string | null;
  currentProjectId: string | null;
  projects: Project[];
  error: string;
}

const initialState: ProjectState = {
  currentWorkspaceId: '644e577dec3c6d76a08a4c20',
  currentProjectId: '644e5c9f7a68932ddc0e2f7c',
  projects: [],
  error: null,
};

export const projectReducer = createReducer<ProjectState>(
  initialState,
  on(ProjectPageActions.setCurrentProject, (state, action): ProjectState => {
    return {
      ...state,
      currentProjectId: action.projectId,
    };
  }),
  on(ProjectApiActions.loadProjectsSuccess, (state, action): ProjectState => {
    return {
      ...state,
      projects: action.projects,
      error: null,
    };
  }),
  on(ProjectApiActions.loadProjectsFailure, (state, action): ProjectState => {
    return {
      ...state,
      error: action.error,
    };
  }),
  on(ProjectApiActions.createProjectSuccess, (state, action): ProjectState => {
    return {
      ...state,
      projects: [...state.projects, action.project],
    };
  }),
  on(ProjectApiActions.updateProjectSuccess, (state, action): ProjectState => {
    const updatedProjects = state.projects.map((project) =>
      action.project.id === project.id ? action.project : project
    );
    return {
      ...state,
      projects: updatedProjects,
    };
  }),

  on(ProjectApiActions.deleteProjectSuccess, (state, action): ProjectState => {
    const updatedProjects = state.projects.filter(
      (p) => p.id !== action.projectId
    );
    return {
      ...state,
      projects: updatedProjects,
    };
  })
);
