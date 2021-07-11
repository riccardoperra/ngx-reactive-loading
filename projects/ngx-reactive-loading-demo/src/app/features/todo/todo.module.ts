import { NgModule } from '@angular/core';

import { FormTodoComponent } from './form-todo/form-todo.component';
import { TodoComponent } from './todo/todo.component';
import { Todo2Component } from './todo-2/todo2.component';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';

export const COMPONENTS = [FormTodoComponent, TodoComponent, Todo2Component];

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
