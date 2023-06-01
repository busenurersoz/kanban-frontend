import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationSidebarComponent } from './components/navigation-sidebar/navigation-sidebar.component';
import { NavigationToolbarComponent } from './components/navigation-toolbar/navigation-toolbar.component';

@NgModule({
  declarations: [NavigationSidebarComponent, NavigationToolbarComponent],
  imports: [CommonModule, SharedModule],
  exports: [NavigationSidebarComponent, NavigationToolbarComponent],
})
export class NavigationModule {}
