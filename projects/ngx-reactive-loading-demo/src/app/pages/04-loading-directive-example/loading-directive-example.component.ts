import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import {
  LOADING_REGISTRY,
  LoadingRegistry,
  LoadingService,
} from 'ngx-reactive-loading';
import { TodoStateService } from '../02-loading-store-service-example/todo.service';
import { Subject } from 'rxjs';
import { exhaustMap, mergeMap } from 'rxjs/operators';
import { Todo } from '../../model/todo';
import { FormControl, Validators } from '@angular/forms';
import { UIStore } from '../../store/ui-store';

enum Actions {
  addTodo = 'add',
  removeTodo = 'remove',
  reloadTodo = 'reload',
}

const defaultLoadingActions = [
  Actions.addTodo,
  Actions.removeTodo,
  Actions.reloadTodo,
];

@Component({
  selector: 'app-loading-directive-example',
  templateUrl: './loading-directive-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoadingService.componentProvider(defaultLoadingActions)],
})
export class LoadingDirectiveExampleComponent implements OnInit {
  readonly pageTitle$ = this.uiStore.pageTitle$;
  readonly todoTitle = new FormControl('', control =>
    Validators.required(control)
  );
  readonly todos$ = this.todoState.todos$;

  // Events
  readonly addEvent$: Subject<string> = new Subject<string>();
  readonly removeEvent$: Subject<string> = new Subject<string>();
  readonly reloadEvent$: Subject<void> = new Subject<void>();

  readonly isLoading$ = this.loadingService.someLoading();

  constructor(
    private readonly todoState: TodoStateService,
    private readonly uiStore: UIStore,
    private readonly loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.reloadEvent$
      .pipe(
        exhaustMap(() =>
          this.todoState
            .reloadTodos()
            .pipe(this.loadingService.track(Actions.reloadTodo))
        )
      )
      .subscribe();

    this.addEvent$
      .pipe(
        mergeMap(title =>
          this.todoState
            .addTodo(title)
            .pipe(this.loadingService.track(Actions.addTodo))
        )
      )
      .subscribe();

    this.removeEvent$
      .pipe(
        exhaustMap(id =>
          this.todoState
            .removeTodo(id)
            .pipe(this.loadingService.track(Actions.removeTodo))
        )
      )
      .subscribe();
  }
}
