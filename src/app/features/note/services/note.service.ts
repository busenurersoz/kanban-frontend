import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ResourceService } from '@core/services/resource-service.service';
import { Note } from '@core/interfaces/note';

@Injectable({
  providedIn: 'root',
})
export class NoteService extends ResourceService<Note> {
  getResourceUrl(): string {
    return 'notes';
  }

  constructor(protected http: HttpClient) {
    super(http);
  }
}
