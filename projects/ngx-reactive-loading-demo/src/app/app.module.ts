import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HotToastModule } from '@ngneat/hot-toast';
import { TodoModule } from './features/todo/todo.module';
import { LayoutModule } from './shared/layout/layout.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatSnackBarModule,
    HotToastModule.forRoot(),
    TodoModule,
    LayoutModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
  ],
  providers: [MatSnackBar],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
