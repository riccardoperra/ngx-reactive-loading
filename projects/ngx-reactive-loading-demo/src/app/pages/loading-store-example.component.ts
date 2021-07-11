import { Component, OnInit } from '@angular/core';
import { createLoadingStore } from '../../../../ngx-reactive-loading/src/lib/utils/create-loading-store';
import { TodoApiService } from '../services/todo-api.service';
import { TodoStateService } from '../services/todo.service';
import { Observable, of, Subject } from 'rxjs';
import { delay, exhaustMap } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { someLoading } from '../../../../ngx-reactive-loading/src/lib/operators/some-loading';

@Component({
  selector: 'app-loading-store-example',
  template: `
    <div>
      <span>Actions</span>
      <hr />
      <button (click)="reloadEvent$.next()">Reload</button>
      <hr />
      <input type="text" [formControl]="todoTitle" />
      <button
        [disabled]="todoTitle.invalid || (isLoading$ | async)"
        (click)="addEvent$.next(todoTitle.value)"
      >
        Add
      </button>
      <ul>
        <li>Add: {{ loadingStore.addTodo.loading$ | async }}</li>
        <li>Reload: {{ loadingStore.reloadTodo.loading$ | async }}</li>
        <li>Remove: {{ loadingStore.removeTodo.loading$ | async }}</li>
      </ul>
    </div>
    <ul>
      <ng-container *ngIf="isLoading$ | async"> Loading...</ng-container>
      <li *ngFor="let todo of todos$ | async">
        <div class="todo-card">
          <div>Id: {{ todo.id }}</div>
          <div>Title: {{ todo.title }}</div>
          <button
            [disabled]="isLoading$ | async"
            (click)="removeEvent$.next(todo.id)"
          >
            Remove
          </button>
        </div>
      </li>
    </ul>
  `,
  styles: [
    //language=scss,
    `
      .todo-card {
        width: 100%;
        padding: 1rem;
        border: 1px solid #1976d2;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class LoadingStoreExampleComponent implements OnInit {
  readonly todos$ = this.todoState.todos$;
  readonly todoTitle = new FormControl('', Validators.required);

  readonly loadingStore = createLoadingStore([
    'addTodo',
    'removeTodo',
    'reloadTodo',
  ]);

  readonly isLoading$ = someLoading([this.loadingStore]);

  readonly addEvent$: Subject<string> = new Subject<string>();
  readonly removeEvent$: Subject<string> = new Subject<string>();
  readonly reloadEvent$: Subject<void> = new Subject<void>();

  constructor(
    private readonly todoService: TodoApiService,
    private readonly todoState: TodoStateService
  ) {}

  ngOnInit() {
    this.reloadEvent$
      .pipe(
        exhaustMap(() =>
          this.todoService.reload().pipe(this.loadingStore.reloadTodo.track())
        )
      )
      .subscribe(console.log);

    this.addEvent$
      .pipe(
        exhaustMap(title =>
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
