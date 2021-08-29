import { NgModule } from '@angular/core';
import { LoadingRegistryExampleComponent } from './loading-registry-example.component';
import { RouterModule } from '@angular/router';
import { TodoModule } from '../../shared/todo/todo.module';
import { FlexModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { TodoStateService } from '../02-loading-store-service-example/todo.service';
import { createLoadingRegistry, LOADING_REGISTRY } from 'ngx-reactive-loading';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LoadingRegistryExampleComponent,
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
  declarations: [LoadingRegistryExampleComponent],
  providers: [
    TodoStateService,
    { provide: LOADING_REGISTRY, useFactory: createLoadingRegistry },
  ],
})
export class LoadingRegistryExampleModule {}
