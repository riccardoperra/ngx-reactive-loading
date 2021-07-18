import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIStore } from '../../store/ui-store';
import { LoadingLogsService } from '../../services/loading-logs.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Store } from '@ngrx/store';
import { selectTodos } from './store/todo.selectors';
import { AppState } from './store';
import todoActions, { LoadingTodoActions } from './store/todo.actions';
import { LoadingService } from 'ngx-reactive-loading';

type PageActions = 'addTodo' | 'removeTodo' | 'reloadTodo';

@Component({
  selector: 'app-loading-store-with-service-example',
  templateUrl: './loading-store-ngrx-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStoreNgrxExampleComponent {
  readonly pageTitle$ = this.uiStore.pageTitle$;
  readonly todos$ = this.store.select(selectTodos);
  readonly isLoading$ = this.loadingStore.someLoading();
  readonly logs$ = this.loadingToastService.getLogs(this.loadingStore);

  readonly isReloadingTodos$ = this.loadingStore.isLoading(
    todoActions.todoReload.type
  );
  readonly isAddingTodo$ = this.loadingStore.isLoading(
    todoActions.todoAdd.type
  );
  readonly isRemovingTodo$ = this.loadingStore.isLoading(
    todoActions.todoReload.type
  );

  constructor(
    private readonly uiStore: UIStore,
    private readonly toastService: HotToastService,
    private readonly loadingToastService: LoadingLogsService<LoadingTodoActions>,
    public readonly loadingStore: LoadingService<LoadingTodoActions>,
    private store: Store<AppState>
  ) {
    this.loadingToastService.observeLoadingStatus(this.loadingStore);
  }

  addTodo(message: string): void {
    this.store.dispatch(todoActions.todoAdd({ message }));
  }

  removeTodo(id: string): void {
    this.store.dispatch(todoActions.todoRemove({ id }));
  }

  reloadTodo(): void {
    this.store.dispatch(todoActions.todoReload());
  }
}
