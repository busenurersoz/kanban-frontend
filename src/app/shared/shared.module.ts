import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSvgIconComponent } from './app-svg-icon/app-svg-icon.component';
import { AppButtonComponent } from './app-button/app-button.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { QuillModule } from 'ngx-quill';
import { IconsProviderModule } from '../icons-provider.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { RouterModule } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzResultModule } from 'ng-zorro-antd/result';
import { MaterialModule } from './material/material.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@NgModule({
  declarations: [AppSvgIconComponent, AppButtonComponent],
  imports: [CommonModule],
  exports: [
    AppSvgIconComponent,
    AppButtonComponent,
    MatRadioModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzRadioModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzSelectModule,
    QuillModule,
    NzAvatarModule,
    NzDropDownModule,
    NzEmptyModule,
    IconsProviderModule,
    NzMenuModule,
    NzDividerModule,
    NzToolTipModule,
    NzModalModule,
    TextFieldModule,
    NzCommentModule,
    NzAlertModule,
    NzNotificationModule,
    NzMessageModule,
    NzTableModule,
    NzResultModule,
    NzCheckboxModule,
    MaterialModule,
    NzDatePickerModule,
  ],
})
export class SharedModule {}
