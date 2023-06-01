import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { FeedbackService } from '@core/services/feedback.service';
import { FeedbackTypes } from '@core/enums/feedback-types.enum';
import { WorkspaceService } from '../services/workspace.service';
import { WorkspacePageActions, WorkspaceApiActions } from './actions';

@Injectable()
export class WorkspaceEffects {
  constructor(
    private actions$: Actions,
    private workspaceService: WorkspaceService,
    private store: Store,
    private feedbackService: FeedbackService
  ) {}

  loadWorkspaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WorkspacePageActions.loadWorkspaces),
      mergeMap(() => {
        return this.workspaceService.findAll().pipe(
          map((workspaces) => {
            return WorkspaceApiActions.loadWorkspacesSuccess({ workspaces });
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'Workspaces could not be loaded',
              error.message
            );
            return of(WorkspaceApiActions.loadWorkspacesFailure({ error }));
          })
        );
      })
    );
  });

  createWorkspace$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WorkspacePageActions.createWorkspace),
      mergeMap((action) => {
        return this.workspaceService.create(action.workspace).pipe(
          mergeMap((workspace) => {
            return [
              WorkspacePageActions.setCurrentWorkspace({
                workspaceId: workspace.id,
              }),
              WorkspaceApiActions.createWorkspaceSuccess({ workspace }),
            ];
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'Workspace could not be created',
              error.message
            );
            return of(WorkspaceApiActions.createWorkspaceFailure({ error }));
          })
        );
      })
    );
  });

  updateWorkspace$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WorkspacePageActions.updateWorkspace),
      mergeMap((action) => {
        return this.workspaceService
          .update(action.workspace.id, action.workspace)
          .pipe(
            map((workspace) => {
              this.feedbackService.createMessage(
                FeedbackTypes.success,
                'Workspace successfully updated.'
              );
              return WorkspaceApiActions.updateWorkspaceSuccess({ workspace });
            }),
            catchError((error) => {
              this.feedbackService.createNotification(
                FeedbackTypes.error,
                'Workspace could not be updated',
                error.message
              );
              return of(WorkspaceApiActions.updateWorkspaceFailure({ error }));
            })
          );
      })
    );
  });

  deleteWorkspace$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WorkspacePageActions.deleteWorkspace),
      mergeMap((action) => {
        return this.workspaceService.remove(action.workspaceId).pipe(
          mergeMap((workspaceId) => {
            this.feedbackService.createMessage(
              FeedbackTypes.success,
              'Workspace successfully moved to trash.'
            );
            return [
              WorkspaceApiActions.deleteWorkspaceSuccess({ workspaceId }),
              // IssuePageActions.deleteAllIssuesByWorkspaceId({ workspaceId }),
            ];
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'Workspace could not be moved to trash',
              error.message
            );
            return of(WorkspaceApiActions.deleteWorkspaceFailure({ error }));
          })
        );
      })
    );
  });
}
