import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { LOADING_REGISTRY, LoadingRegistry } from 'ngx-reactive-loading';
import { TodoStateService } from '../02-loading-store-service-example/todo.service';
import { exhaustMap, mergeMap, Subject } from 'rxjs';
import { Todo } from '../../model/todo';
import { FormControl, Validators } from '@angular/forms';
import { UIStore } from '../../store/ui-store';

enum Actions {
  addTodo = 'addTodo',
  removeTodo = 'removeTodo',
  reloadTodo = 'reloadTodo',
}

const defaultLoadingActions = [
  Actions.addTodo,
  Actions.removeTodo,
  Actions.reloadTodo,
];

@Component({
  selector: 'app-loading-registry-example',
  templateUrl: './loading-registry-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingRegistryExampleComponent implements OnInit {
  readonly pageTitle$ = this.uiStore.pageTitle$;
  readonly todoTitle = new FormControl('', control =>
    Validators.required(control)
  );
  readonly todos$ = this.todoState.todos$;

  // Events
  readonly addEvent$: Subject<string> = new Subject<string>();
  readonly removeEvent$: Subject<string> = new Subject<string>();
  readonly reloadEvent$: Subject<void> = new Subject<void>();

  readonly isRemoving$ = this.loadingRegistry.isLoading(Actions.removeTodo);
  readonly isAdding$ = this.loadingRegistry.isLoading(Actions.addTodo);
  readonly isReloading$ = this.loadingRegistry.isLoading(Actions.reloadTodo);

  readonly isLoading$ = this.loadingRegistry.someLoading([
    Actions.addTodo,
    Actions.reloadTodo,
  ]);

  // UI
  readonly trackByTodo: TrackByFunction<Todo> = (_, todo) => todo.id;

  constructor(
    private readonly todoState: TodoStateService,
    private readonly uiStore: UIStore,
    @Inject(LOADING_REGISTRY) readonly loadingRegistry: LoadingRegistry
  ) {}

  ngOnInit() {
    this.loadingRegistry.addAll(defaultLoadingActions);

    this.reloadEvent$
      .pipe(
        exhaustMap(() =>
          this.todoState
            .reloadTodos()
            .pipe(this.loadingRegistry.track(Actions.reloadTodo))
        )
      )
      .subscribe();

    this.addEvent$
      .pipe(
        mergeMap(title =>
          this.todoState
            .addTodo(title)
            .pipe(this.loadingRegistry.track(Actions.addTodo))
        )
      )
      .subscribe();

    this.removeEvent$
      .pipe(
        exhaustMap(id =>
          this.todoState
            .removeTodo(id)
            .pipe(this.loadingRegistry.track(Actions.removeTodo))
        )
      )
      .subscribe();
  }
}
