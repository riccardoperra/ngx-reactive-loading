import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LogsComponent } from './logs/logs.component';
import { MatChipsModule } from '@angular/material/chips';
import { ExtendedModule, FlexModule } from '@angular/flex-layout';

const COMPONENTS = [HeaderComponent, SidebarComponent, LogsComponent];

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    FlexModule,
    ExtendedModule,
  ],
  exports: [COMPONENTS],
  declarations: [COMPONENTS],
  providers: [],
})
export class LayoutModule {}
