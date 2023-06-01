import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ResourceService } from '@core/services/resource-service.service';
import { Todo } from '@core/interfaces/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService extends ResourceService<Todo> {
  getResourceUrl(): string {
    return 'todos';
  }

  constructor(protected http: HttpClient) {
    super(http);
  }
}
