import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Todo } from '../../../model/todo';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  @Input() todo?: Todo;
  @Input() loading: boolean = false;
  @Output() readonly removeEvent: EventEmitter<string> =
    new EventEmitter<string>();

  constructor() {}
}
