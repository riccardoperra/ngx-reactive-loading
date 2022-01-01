import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
} from '@angular/core';
import { Todo } from '../../../model/todo';
import { LoadingService, SOME_LOADING } from 'ngx-reactive-loading';
import {
  TODO_ACTIONS,
  TodoActions,
} from '../../../pages/03-loading-store-ngrx-example/store/todo.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-with-di',
  templateUrl: './todo-with-di.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoWithDiComponent {
  @Input() todo?: Todo;
  @Output() readonly removeEvent = new EventEmitter<string>();

  constructor(
    @Inject(TODO_ACTIONS) private readonly todoActions: TodoActions,
    @Optional() private readonly loadingService: LoadingService,
    @Inject(SOME_LOADING) readonly isLoading$: Observable<boolean>
  ) {}
}
