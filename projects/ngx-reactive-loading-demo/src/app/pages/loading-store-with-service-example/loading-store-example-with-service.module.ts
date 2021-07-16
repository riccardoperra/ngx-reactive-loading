import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TodoModule } from '../../features/todo/todo.module';
import { FlexModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { LoadingStoreWithServiceExampleComponent } from './loading-store-with-service-example.component';
import { LayoutModule } from '../../shared/layout/layout.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoadingStoreWithServiceExampleComponent,
      },
    ]),
    TodoModule,
    FlexModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    LayoutModule,
  ],
  exports: [RouterModule],
  declarations: [LoadingStoreWithServiceExampleComponent],
  providers: [],
})
export class LoadingStoreExampleWithServiceModule {}
