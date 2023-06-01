import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-workspace-create-page',
  templateUrl: './workspace-create-page.component.html',
  styleUrls: ['./workspace-create-page.component.scss'],
})
export class WorkspaceCreatePageComponent implements OnInit {
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // this.currentUser$ = this.store.select(getCurrentUser)
    //   .pipe(filter(user => Boolean(user)));
    this.titleService.setTitle('Create Workspace - Kanban Project Management');
  }
}
