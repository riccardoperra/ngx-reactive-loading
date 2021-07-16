import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { createLoadingStore, someLoading } from 'ngx-reactive-loading';
import { TodoApiService } from '../../services/todo-api.service';
import { TodoStateService } from '../../services/todo.service';
import { Subject } from 'rxjs';
import { exhaustMap, mergeMap } from 'rxjs/operators';
import { Todo } from '../../model/todo';
import { FormControl, Validators } from '@angular/forms';
import { UIStore } from '../../store/ui-store';
import { LoadingToastService } from '../../services/loading-toast.service';

@Component({
  selector: 'app-loading-store-example',
  templateUrl: './loading-store-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStoreExampleComponent implements OnInit {
  readonly pageTitle$ = this.uiStore.pageTitle$;
  readonly todoTitle = new FormControl('', Validators.required);
  readonly todos$ = this.todoState.todos$;

  // Events
  readonly addEvent$: Subject<string> = new Subject<string>();
  readonly removeEvent$: Subject<string> = new Subject<string>();
  readonly reloadEvent$: Subject<void> = new Subject<void>();

  // Loading
  readonly loadingStore = createLoadingStore([
    'addTodo',
    'removeTodo',
    'reloadTodo',
  ]);

  readonly isReloading$ = this.loadingStore.reloadTodo.loading$;

  readonly isLoading$ = someLoading([
    this.loadingStore.addTodo,
    this.loadingStore.removeTodo,
  ]);

  readonly someLoading = someLoading([this.isReloading$, this.isLoading$]);

  // UI
  readonly trackByTodo: TrackByFunction<Todo> = (_, todo) => todo.id;

  constructor(
    private readonly todoService: TodoApiService,
    private readonly todoState: TodoStateService,
    private readonly uiStore: UIStore
  ) {}

  ngOnInit() {
    this.reloadEvent$
      .pipe(
        exhaustMap(() =>
          this.todoService.reload().pipe(this.loadingStore.reloadTodo.track())
        )
      )
      .subscribe();

    this.addEvent$
      .pipe(
        mergeMap(title =>
          this.todoService.add(title).pipe(this.loadingStore.addTodo.track())
        )
      )
      .subscribe();

    this.removeEvent$
      .pipe(
        exhaustMap(id =>
          this.todoService.remove(id).pipe(this.loadingStore.removeTodo.track())
        )
      )
      .subscribe();
  }
}
