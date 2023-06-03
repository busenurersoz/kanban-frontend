import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '@shared/shared.module';
import { NoteModule } from '@features/note/note.module';
import { ProjectModule } from '@features/project/project.module';
import { TodoModule } from '@features/todo/todo.module';
import { UserModule } from '@features/user/user.module';
import { WorkspaceModule } from '@features/workspace/workspace.module';
import { QuillModule } from 'ngx-quill';
import { CoreModule } from '@core/core.module';
import { NavigationModule } from '@features/navigation/navigation.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    WorkspaceModule,
    TodoModule,
    NoteModule,
    ProjectModule,
    UserModule,
    QuillModule,
    NzLayoutModule,
    NavigationModule,
    CoreModule,
  ],
})
export class LayoutModule {}
