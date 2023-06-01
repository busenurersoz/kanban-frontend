import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Project } from '@core/interfaces/project';
import { Workspace } from '@core/interfaces/workspace';
import { IssueCreateModalComponent } from '@features/issues/components/issue-create-modal/issue-create-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppState } from '@core/interfaces/app.state';
import { isCurrentWorkspace } from '@features/workspace/state/workspace.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss'],
})
export class BoardHeaderComponent implements OnInit {
  @Input() currentWorkspace$: Observable<Workspace>;
  @Input() currentProject$: Observable<Project>;

  isCurrentWorkspace$: Observable<boolean>;

  constructor(
    private modalService: NzModalService,
    private store: Store<AppState>
  ) {}
  ngOnInit(): void {
    this.isCurrentWorkspace$ = this.store.select(isCurrentWorkspace);
  }

  openCreateIssueModal() {
    this.modalService.create({
      nzTitle: 'Create Issue',
      nzContent: IssueCreateModalComponent,
      nzFooter: null,
      nzKeyboard: false,
      nzMaskClosable: false,
      nzWidth: 700,
    });
  }
}
