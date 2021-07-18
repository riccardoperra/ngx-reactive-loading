import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { todoReducer } from './store/todo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from './store/todo.effects';
import { RouterModule } from '@angular/router';
import { LoadingStoreNgrxExampleComponent } from './loading-store-ngrx-example.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LayoutModule } from '../../shared/layout/layout.module';
import { MatListModule } from '@angular/material/list';
import { TodoModule } from '../../shared/todo/todo.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppState } from './store';
import todoActions from './store/todo.actions';
import { ReactiveLoadingModule } from 'ngx-reactive-loading';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot<AppState>({
      todo: todoReducer,
    }),
    ReactiveLoadingModule.forFeature([
      todoActions.todoAdd.type,
      todoActions.todoRemove.type,
      todoActions.todoReload.type,
    ]),
    EffectsModule.forRoot([TodoEffects]),
    RouterModule.forChild([
      {
        path: '',
        component: LoadingStoreNgrxExampleComponent,
      },
    ]),
    MatCardModule,
    LayoutModule,
    MatListModule,
    TodoModule,
    MatProgressSpinnerModule,
    FlexModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
  declarations: [LoadingStoreNgrxExampleComponent],
  bootstrap: [],
})
export class LoadingStoreNgrxExampleModule {}
