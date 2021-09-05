import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { LOADING_REGISTRY, LoadingRegistry } from 'ngx-reactive-loading';
import { merge, Subject } from 'rxjs';
import { UIStore } from '../../store/ui-store';
import { map, scan, shareReplay } from 'rxjs/operators';
import { TodoCustomAction } from './models/todo-state-action';

enum Actions {
  addTodo = 'addTodo',
  removeTodo = 'removeTodo',
  reloadTodo = 'reloadTodo',
}

@Component({
  selector: 'app-loading-registry-example',
  templateUrl: './loading-registry-dynamic-actions-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingRegistryDynamicActionsExampleComponent implements OnInit {
  readonly tableColumns = ['position', 'label', 'key', 'loading', 'actions'];
  readonly pageTitle$ = this.uiStore.pageTitle$;

  // Events
  readonly add$ = new Subject<TodoCustomAction>();
  readonly remove$: Subject<TodoCustomAction> = new Subject<TodoCustomAction>();

  readonly actions$ = merge(
    this.add$.pipe(map((data): ['add', TodoCustomAction] => ['add', data])),
    this.remove$.pipe(
      map((data): ['remove', TodoCustomAction] => ['remove', data])
    )
  ).pipe(
    scan((acc, [type, payload]) => {
      switch (type) {
        case 'add': {
          // Add key to registry
          this.loadingRegistry.add(payload.key);
          return acc.concat(payload);
        }
        case 'remove': {
          // Remove key to registry
          this.loadingRegistry.delete(payload.key);
          return acc.filter(actions => actions.key !== payload.key);
        }
      }
    }, [] as TodoCustomAction[]),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  readonly trackByAction: TrackByFunction<TodoCustomAction> = (_, action) =>
    action.key;

  constructor(
    private readonly uiStore: UIStore,
    @Inject(LOADING_REGISTRY) readonly loadingRegistry: LoadingRegistry
  ) {}

  ngOnInit() {}

  callAction(action: TodoCustomAction) {
    // Update state by key
    action
      .call()
      .pipe(this.loadingRegistry.track(action.key))
      .subscribe(console.log);
  }
}
