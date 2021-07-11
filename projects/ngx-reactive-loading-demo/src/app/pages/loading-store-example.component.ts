import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { createLoadingStore } from '../../../../ngx-reactive-loading/src/lib/utils/create-loading-store';
import { TodoApiService } from '../services/todo-api.service';
import { TodoStateService } from '../services/todo.service';
import { Observable, of, Subject } from 'rxjs';
import { delay, exhaustMap } from 'rxjs/operators';
import { Todo } from '../model/todo';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-loading-store-example',
  templateUrl: './loading-store-example.component.html',
  styleUrls: ['./loading-store-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStoreExampleComponent implements OnInit {
  readonly todoTitle = new FormControl('', Validators.required);
  readonly todos$ = this.todoState.todos$;

  // Events
  readonly addEvent$: Subject<string> = new Subject<string>();
  readonly reloadEvent$: Subject<void> = new Subject<void>();

  // Loading
  readonly loadingStore = createLoadingStore([
    'addTodo',
    'editTodo',
    'getTodo',
    'removeTodo',
    'reloadTodo',
  ]);

  // UI
  readonly trackByTodo: TrackByFunction<Todo> = (_, todo) => todo.id;

  constructor(
    private readonly todoService: TodoApiService,
    private readonly todoState: TodoStateService
  ) {}

  ngOnInit() {
    this.reloadEvent$
      .pipe(
        exhaustMap(() =>
          this.reload().pipe(this.loadingStore.reloadTodo.track())
        )
      )
      .subscribe();

    this.addEvent$
      .pipe(
        exhaustMap(title =>
          this.addTodo(title).pipe(this.loadingStore.addTodo.track())
        )
      )
      .subscribe();
  }

  addTodo(title: string): Observable<Todo> {
    return this.todoService.add(title);
  }

  removeTodo(id: string): void {
    this.todoService.remove(id).pipe(this.loadingStore.removeTodo.track());
  }

  reload(): Observable<void> {
    return of(void 0).pipe(delay(2500));
  }
}
