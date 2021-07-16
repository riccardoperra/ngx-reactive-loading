import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { LoadingEvent } from 'ngx-reactive-loading';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsComponent implements OnInit {
  @Input() logs: LoadingEvent[] = [];

  readonly trackByLogs: TrackByFunction<LoadingEvent> = (_, log) =>
    `${_}_${log.type.toString()}`;

  constructor() {}

  ngOnInit(): void {}
}
