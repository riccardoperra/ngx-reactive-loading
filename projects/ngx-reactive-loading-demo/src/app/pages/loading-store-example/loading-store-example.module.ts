import { NgModule } from '@angular/core';
import { LoadingStoreExampleComponent } from './loading-store-example.component';
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

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LoadingStoreExampleComponent,
      },
    ]),
    TodoModule,
    FlexModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
  ],
  exports: [RouterModule],
  declarations: [LoadingStoreExampleComponent],
  providers: [],
})
export class LoadingStoreExampleModule {}
