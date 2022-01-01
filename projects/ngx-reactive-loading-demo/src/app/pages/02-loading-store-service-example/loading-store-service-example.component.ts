import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { TodoStateService } from './todo.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { exhaustMap, mergeMap } from 'rxjs';
import { LoadingService } from 'ngx-reactive-loading';
import { UIStore } from '../../store/ui-store';
import { LoadingLogsService } from '../../services/loading-logs.service';
import { HotToastService } from '@ngneat/hot-toast';
import { DestroyService } from '../../services/destroy.service';

type PageActions = 'addTodo' | 'removeTodo' | 'reloadTodo';

@Component({
  selector: 'app-loading-store-with-service-example',
  templateUrl: './loading-store-service-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    LoadingService.componentProvider<PageActions>([
      'addTodo',
      'removeTodo',
      'reloadTodo',
    ]),
    LoadingLogsService,
    DestroyService,
  ],
})
export class LoadingStoreServiceExampleComponent implements OnInit {
  // Events
  readonly addEvent$: Subject<string> = new Subject<string>();
  readonly removeEvent$: Subject<string> = new Subject<string>();
  readonly reloadEvent$: Subject<void> = new Subject<void>();

  readonly pageTitle$ = this.uiStore.pageTitle$;
  readonly todos$ = this.todoState.todos$;
  readonly isLoading$ = this.loadingStore.someLoading();

  readonly logs$ = this.loadingToastService.getLogs(this.loadingStore);

  constructor(
    @Inject(DestroyService) private readonly destroy$: Observable<void>,
    private readonly todoState: TodoStateService,
    private readonly uiStore: UIStore,
    private readonly toastService: HotToastService,
    private readonly loadingToastService: LoadingLogsService<PageActions>,
    public readonly loadingStore: LoadingService<PageActions>
  ) {
    this.loadingToastService.observeLoadingStatus(this.loadingStore);
  }

  ngOnInit() {
    // Using Load method
    this.reloadEvent$
      .pipe(
        exhaustMap(() =>
          this.loadingStore.load(this.todoState.reloadTodos(), 'reloadTodo')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // Using Track method
    this.addEvent$
      .pipe(
        exhaustMap(title =>
          this.todoState.addTodo(title).pipe(this.loadingStore.track('addTodo'))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // Without Loading Store interface
    this.removeEvent$
      .pipe(
        mergeMap(id =>
          this.todoState
            .removeTodo(id)
            .pipe(this.loadingStore.state.removeTodo.track())
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
