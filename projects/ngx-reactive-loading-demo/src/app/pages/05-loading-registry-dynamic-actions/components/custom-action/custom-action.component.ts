import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { CustomAction } from '../../models/custom-action';
import { ReplaySubject, map, switchMap } from 'rxjs';
import { LOADING_REGISTRY, LoadingRegistry } from 'ngx-reactive-loading';

@Component({
  selector: 'app-custom-action',
  templateUrl: './custom-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomActionComponent<T> {
  private readonly actionSubject$: ReplaySubject<CustomAction<T>> =
    new ReplaySubject<CustomAction<T>>();

  private readonly key$ = this.actionSubject$.pipe(map(({ key }) => key));

  readonly action$ = this.actionSubject$.asObservable();

  readonly isLoading$ = this.key$.pipe(
    switchMap(key => this.loadingRegistry.isLoading(key))
  );

  @Input()
  set action(_: CustomAction<T>) {
    this.actionSubject$.next(_);
  }

  @Output() readonly clickEvent = new EventEmitter<CustomAction<T>>();

  constructor(
    @Inject(LOADING_REGISTRY) readonly loadingRegistry: LoadingRegistry
  ) {}
}
