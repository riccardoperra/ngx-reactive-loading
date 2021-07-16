import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { TodoApiService } from '../../services/todo-api.service';
import { TodoStateService } from '../../services/todo.service';
import { Subject } from 'rxjs';
import { exhaustMap, mergeMap, scan, shareReplay } from 'rxjs/operators';
import { Todo } from '../../model/todo';
import {
  LoadingEvent,
  LoadingService,
  provideLoadingService,
} from 'ngx-reactive-loading';
import { UIStore } from '../../store/ui-store';
import { LoadingToastService } from '../../services/loading-toast.service';
import { HotToastService } from '@ngneat/hot-toast';

type PageActions = 'addTodo' | 'removeTodo' | 'reloadTodo';

@Component({
  selector: 'app-loading-store-with-service-example',
  templateUrl: './loading-store-with-service-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideLoadingService<PageActions>(['addTodo', `removeTodo`, 'reloadTodo']),
  ],
})
export class LoadingStoreWithServiceExampleComponent implements OnInit {
  readonly pageTitle$ = this.uiStore.pageTitle$;

  readonly todos$ = this.todoState.todos$;

  // Events
  readonly addEvent$: Subject<string> = new Subject<string>();
  readonly removeEvent$: Subject<string> = new Subject<string>();
  readonly reloadEvent$: Subject<void> = new Subject<void>();

  readonly isLoading$ = this.loadingStore.someLoading();

  readonly logs$ = this.loadingStore.events$.pipe(
    scan((acc, value) => acc.concat(value), [] as LoadingEvent[]),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  // UI
  readonly trackByTodo: TrackByFunction<Todo> = (_, todo) => todo.id;

  constructor(
    private readonly todoService: TodoApiService,
    private readonly todoState: TodoStateService,
    private readonly uiStore: UIStore,
    private readonly toastService: HotToastService,
    private readonly loadingToastService: LoadingToastService<PageActions>,
    public readonly loadingStore: LoadingService<PageActions>
  ) {
    this.loadingToastService.observeLoadingStatus(this.loadingStore);
  }

  ngOnInit() {
    // Using Load method
    this.reloadEvent$
      .pipe(
        exhaustMap(() =>
          this.loadingStore.load(() => this.todoService.reload(), 'reloadTodo')
        )
      )
      .subscribe();

    // Using Track method
    this.addEvent$
      .pipe(
        exhaustMap(title =>
          this.todoService.add(title).pipe(this.loadingStore.track('addTodo'))
        )
      )
      .subscribe();

    // Without Loading Store interface
    this.removeEvent$
      .pipe(
        mergeMap(id =>
          this.todoService
            .remove(id)
            .pipe(this.loadingStore.state.removeTodo.track())
        )
      )
      .subscribe();
  }
}
