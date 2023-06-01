import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Project } from '@core/interfaces/project';
import { ResourceService } from '@core/services/resource-service.service';
import { Workspace } from '@core/interfaces/workspace';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService extends ResourceService<Workspace> {
  getResourceUrl(): string {
    return 'workspaces';
  }

  constructor(protected http: HttpClient) {
    super(http);
  }

  isWorkspaceNameTaken(workspaceName: string): Observable<Workspace[]> {
    const url = `${this.API_URL}?name=${workspaceName}`;
    return this.http.get<Workspace[]>(url);
  }

  isWorkspaceKeyTaken(workspanceKey: string): Observable<Workspace[]> {
    const url = `${this.API_URL}?key=${workspanceKey}`;
    return this.http.get<Workspace[]>(url);
  }
}
