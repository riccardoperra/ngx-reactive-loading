import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UIStore } from '../../store/ui-store';
import { LoadingLogsService } from '../../services/loading-logs.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Store } from '@ngrx/store';
import { selectTodosList } from './store';
import {
  LoadingTodoActions,
  TODO_ACTIONS,
  TodoActions,
} from './store/todo.actions';
import { LoadingService } from 'ngx-reactive-loading';
import { AppState } from './loading-store-ngrx-example.module';
import { DestroyService } from '../../services/destroy.service';

@Component({
  selector: 'app-loading-store-with-service-example',
  templateUrl: './loading-store-ngrx-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoadingLogsService, DestroyService],
})
export class LoadingStoreNgrxExampleComponent {
  readonly pageTitle$ = this.uiStore.pageTitle$;
  readonly todos$ = this.store.select(selectTodosList);
  readonly isLoading$ = this.loadingStore.someLoading();
  readonly logs$ = this.loadingToastService.getLogs(this.loadingStore);

  readonly isReloadingTodos$ = this.loadingStore.isLoading(
    this.todoActions.todoReload.type
  );
  readonly isAddingTodo$ = this.loadingStore.isLoading(
    this.todoActions.todoAdd.type
  );
  readonly isRemovingTodo$ = this.loadingStore.isLoading(
    this.todoActions.todoReload.type
  );

  constructor(
    @Inject(TODO_ACTIONS) private readonly todoActions: TodoActions,
    private readonly uiStore: UIStore,
    private readonly toastService: HotToastService,
    private readonly loadingToastService: LoadingLogsService<LoadingTodoActions>,
    public readonly loadingStore: LoadingService<LoadingTodoActions>,
    private store: Store<AppState>
  ) {
    this.loadingToastService.observeLoadingStatus(this.loadingStore);
  }

  addTodo(message: string): void {
    this.store.dispatch(this.todoActions.todoAdd({ message }));
  }

  removeTodo(id: string): void {
    this.store.dispatch(this.todoActions.todoRemove({ id }));
  }

  reloadTodo(): void {
    this.store.dispatch(this.todoActions.todoReload());
  }
}
