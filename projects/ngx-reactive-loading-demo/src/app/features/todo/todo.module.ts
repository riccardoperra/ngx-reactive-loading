import { NgModule } from '@angular/core';

import { FormTodoComponent } from './form-todo/form-todo.component';
import { TodoComponent } from './todo/todo.component';
import { TodoWithDiComponent } from './todo-with-di/todo-with-di.component';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TodoListComponent } from './todo-list/todo-list.component';

export const COMPONENTS = [
  FormTodoComponent,
  TodoComponent,
  TodoWithDiComponent,
  TodoListComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    FlexLayoutModule,
  ],
  exports: [COMPONENTS],
  declarations: [COMPONENTS],
  providers: [],
})
export class TodoModule {}
