import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { Todo } from '../../../model/todo';
import { LoadingService } from 'ngx-reactive-loading';
import todoActions from '../../../pages/03-loading-store-ngrx-example/store/todo.actions';

@Component({
  selector: 'app-todo-with-di',
  templateUrl: './todo-with-di.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoWithDiComponent {
  @Input() todo?: Todo;
  @Output() readonly removeEvent = new EventEmitter<string>();
  readonly isLoading$ = this.loadingService.someLoading([
    todoActions.todoRemove.type,
  ]);

  constructor(@Optional() private readonly loadingService: LoadingService) {}
}
