import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { SvgDefinitionsComponent } from './svg-definitions/svg-definitions.component';

@NgModule({
  declarations: [SvgDefinitionsComponent],
  imports: [CommonModule, SharedModule],
  exports: [SvgDefinitionsComponent],
})
export class CoreModule {}
