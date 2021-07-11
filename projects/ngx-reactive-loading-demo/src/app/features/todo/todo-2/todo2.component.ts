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
import { LoadingService } from '../../../../../../ngx-reactive-loading/src/lib/services/loading.service';

@Component({
  selector: 'app-todo-2',
  templateUrl: './todo2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Todo2Component {
  @Input() todo?: Todo;
  @Output() readonly removeEvent = new EventEmitter<string>();
  readonly isLoading$ = this.loadingService.someLoading();

  constructor(@Optional() private readonly loadingService: LoadingService) {}
}
