import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';
import { Todo } from '../../../model/todo';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Input() todoTpl?: TemplateRef<{ $implicit: Todo }>;
  readonly trackByTodo: TrackByFunction<Todo> = (_, todo) => todo.id;

  constructor() {}
}
