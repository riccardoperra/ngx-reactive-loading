import { NgModule } from '@angular/core';
import { LoadingRegistryDynamicActionsExampleComponent } from './loading-registry-dynamic-actions-example.component';
import { RouterModule } from '@angular/router';
import { TodoModule } from '../../shared/todo/todo.module';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { createLoadingRegistry, LOADING_REGISTRY } from 'ngx-reactive-loading';
import { CustomActionComponent } from './components/custom-action/custom-action.component';
import { TodoStateService } from '../02-loading-store-service-example/todo.service';
import { AddActionFormComponent } from './components/add-action-form/add-action-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MapperPipeModule } from '../../shared/pipes/mapper/mapper.pipe';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LoadingRegistryDynamicActionsExampleComponent,
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
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MapperPipeModule,
    MatChipsModule,
    FlexLayoutModule,
  ],
  declarations: [
    LoadingRegistryDynamicActionsExampleComponent,
    CustomActionComponent,
    AddActionFormComponent,
  ],
  providers: [
    TodoStateService,
    { provide: LOADING_REGISTRY, useFactory: createLoadingRegistry },
  ],
})
export class LoadingRegistryDynamicActionsExampleModule {}
