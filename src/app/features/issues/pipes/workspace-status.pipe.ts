import { Pipe, PipeTransform } from '@angular/core';

import {
  WorkspaceStatus,
  WorkspaceStatusDisplay,
} from '@core/interfaces/issue';

@Pipe({
  name: 'workspaceStatus',
})
export class WorkspaceStatusPipe implements PipeTransform {
  transform(workspaceStatus: WorkspaceStatus): string {
    return WorkspaceStatusDisplay[workspaceStatus].toUpperCase();
  }
}
