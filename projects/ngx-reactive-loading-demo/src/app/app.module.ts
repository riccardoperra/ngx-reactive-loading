import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoadingStoreExampleComponent } from './pages/loading-store-example.component';
import { AppRoutingModule } from './app-routing.module';
import { TodoApiService } from './services/todo-api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent, LoadingStoreExampleComponent],
  imports: [CommonModule, BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [TodoApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
