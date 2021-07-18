import {
  Inject,
  Injectable,
  OnDestroy,
  Optional,
  Provider,
  SkipSelf,
} from '@angular/core';
import {
  defer,
  merge,
  MonoTypeOperatorFunction,
  Observable,
  pipe,
  Subject,
} from 'rxjs';
import { LoadingEvent, LoadingStore, LoadingStoreState } from '../model';
import { createLoadingStore } from '../utils';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  skip,
  takeUntil,
} from 'rxjs/operators';
import { someLoading } from '../operators';
import { PropertyTuple } from '../model/property';
import { provideLoadingService } from '../providers/provider';
import {
  INITIAL_LOADING_STORE,
  LOADING_STORE_OPTIONS,
  PARENT_LOADING_STORE,
} from '../providers/token';
import { LoadingStoreOptions } from '../model/loading-store-options';

@Injectable()
export class LoadingService<T extends PropertyKey = PropertyKey>
  implements OnDestroy
{
  /**
   * @internal
   * @private
   * Used only internally, it could be used for lazy loading state in the future.
   */
  private readonly isInitialized: boolean = false;

  /**
   * @internal
   * @private
   * Destroy subject to unsubscribe automatically all subscriptions if service is provided in component.
   */
  private readonly destroy$: Subject<void> = new Subject<void>();
  /**
   * @internal
   * @private
   */
  private readonly initializedErrorMessage = `[${this.constructor.name}] Loading state already initialized`;
  /**
   * @internal
   * @private
   */
  private readonly notInitializedErrorMessage = `[${this.constructor.name}] Loading state is not initialized yet`;
  /**
   * The loading store state.
   */
  readonly state: LoadingStore<PropertyTuple<T>>;

  /**
   * Track all changes of each current LoadingService loading state property.
   */
  readonly events$: Observable<LoadingEvent> = defer(() => {
    const entries = Object.entries<LoadingStoreState>(this.state);
    const events$ = entries.map(([type, state]) =>
      state.$.pipe(map(isLoading => ({ type, loading: isLoading })))
    );
    const entriesLength = entries.length;
    return merge(...events$).pipe(skip(entriesLength));
  }).pipe(
    shareReplay({ refCount: true, bufferSize: 1 }),
    takeUntil(this.destroy$)
  );

  /**
   * Helper to provide a LoadingService into a component. His use is necessary
   * to provide each constructor property to initialize the service in
   * the right way.
   *
   * Options default value is {standalone: false}.
   */
  static componentProvider<T extends PropertyKey>(
    keys: PropertyTuple<T>,
    options?: LoadingStoreOptions
  ): Provider[] {
    return provideLoadingService(keys, options);
  }

  constructor(
    /**
     * Loading keys of the loading store
     */
    @Inject(INITIAL_LOADING_STORE)
    private readonly defaultValue: PropertyTuple<T>,
    /**
     * Options of the loading store
     */
    @Inject(LOADING_STORE_OPTIONS)
    private readonly options: LoadingStoreOptions,
    /**
     * Injected Loading service parent. It could be the service instantiated by the forRoot/forChild module
     * or by a component provider. If there aren't parent instantiated service or `standalone` options is provided,
     * the parent property will be null.
     */
    @Inject(PARENT_LOADING_STORE)
    @Optional()
    @SkipSelf()
    private readonly parent: LoadingService | null
  ) {
    this.state = createLoadingStore(defaultValue);
    this.isInitialized = true;
  }

  /**
   * Returns the given observable with the loading operator attached.
   * This allows to update the loading state of the given property
   * automatically after each value emission.
   *
   * @example
   * ```ts
   * import {LoadingService} from 'ngx-reactive-loading';
   *
   * type ExampleActions = 'add' | 'delete';
   *
   * @Component({
   *   template: ``,
   *   providers: [
   *     LoadingService.componentProvide<ExampleActions>(['add', 'delete'])
   *   ]
   * })
   * export class ExampleComponent {
   *   constructor(private readonly loadingService: LoadingService<ExampleActions>,
   *               private readonly http: HttpClient) {
   *     this.loadingService
   *      .load(this.http.post('/', {}), 'add')
   *      .subscribe();
   *   }
   * }
   * ```
   *
   */
  load<S>(source$: Observable<S>, property: T): Observable<S> {
    return defer(() => {
      if (!this.state) {
        throw new Error(this.initializedErrorMessage);
      }
      return source$.pipe(this.state[property].track());
    });
  }

  /**
   * Wrapper of state.key.track() pipe. This operator will update
   * automatically the loading state property by the given key.
   *
   * @example
   * ```ts
   * import {LoadingService} from 'ngx-reactive-loading';
   *
   * type ExampleActions = 'add' | 'delete';
   *
   * @Component({
   *   template: ``,
   *   providers: [
   *     LoadingService.componentProvide<ExampleActions>(['add', 'delete'])
   *   ]
   * })
   * export class ExampleComponent {
   *   constructor(private readonly loadingService: LoadingService<ExampleActions>,
   *               private readonly http: HttpClient) {
   *     this.http.post('/', {})
   *      .pipe(this.loadingService.track('add'))
   *      .subscribe();
   *   }
   * }
   * ```
   */
  track<O>(key: T): MonoTypeOperatorFunction<O> {
    if (!this.state) {
      throw new Error(this.notInitializedErrorMessage);
    }

    const loadingStoreState = this.state[key];

    if (!loadingStoreState) {
      return pipe();
    }

    return loadingStoreState.track();
  }

  /**
   * Track the changes of the given loading state property.
   * The returned observable has built-in memoization with
   * default rxjs distinctUntilChange operator and the value
   * is shared among all subscribers (shareReplay({refCount: true, bufferSize: 1}))
   *
   * @example
   * ```ts
   * import {LoadingService} from 'ngx-reactive-loading';
   *
   * type ExampleActions = 'add' | 'delete';
   *
   * @Component({
   *   template: ``,
   *   providers: [
   *     LoadingService.componentProvide<ExampleActions>(['add', 'delete'])
   *   ]
   * })
   * export class ExampleComponent {
   *   readonly isAdd$: Observable<boolean> = this.loadingService.isLoading('add');
   *
   *   constructor(private readonly loadingService: LoadingService<ExampleActions>)
   * }
   * ```
   *
   */
  isLoading(key: T): Observable<boolean> {
    return this.someLoading([key]);
  }

  /**
   * Track the changes of one or more given loading state. If no properties are
   * provided, all loading store property will be checked.
   *
   * @example
   * ```ts
   * import {LoadingService} from 'ngx-reactive-loading';
   *
   * type ExampleActions = 'add' | 'delete';
   *
   * @Component({
   *   template: ``,
   *   providers: [
   *     LoadingService.componentProvide<ExampleActions>(['add', 'delete'])
   *   ]
   * })
   * export class ExampleComponent {
   *   readonly isAddingOrDeleting$ = this.loadingService.someLoading([
   *    'add',
   *    'delete'
   *   ]);
   *
   *   constructor(private readonly loadingService: LoadingService<ExampleActions>)
   * }
   * ```
   */
  someLoading(identifier: PropertyTuple<T> = []): Observable<boolean> {
    if (!this.state) {
      throw new Error(this.notInitializedErrorMessage);
    }

    return defer(() => {
      if (!identifier || identifier.length === 0) {
        return someLoading([this.state]);
      }

      const loadingStates = this.getLoadingByIdentifiers(identifier);

      return someLoading(loadingStates);
    }).pipe(
      distinctUntilChanged(),
      shareReplay({ refCount: true, bufferSize: 1 }),
      takeUntil(this.destroy$)
    );
  }

  private getLoadingByIdentifiers(
    identifiers: PropertyTuple<T>
  ): LoadingStoreState[] {
    if (!this.state) {
      throw new Error(this.notInitializedErrorMessage);
    }

    const stores: LoadingStoreState[] = [];

    for (const identifier of identifiers) {
      const loadingState =
        this.state[identifier] || this.getAllParentStates()[identifier];
      if (loadingState) {
        stores.push(loadingState);
      }
    }

    return stores;
  }

  /**
   * Used to automatically unsubscribe all
   * subscribers (only if service is provided attached in a Component)
   */
  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private unsubscribe(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getAllParents(): LoadingService[] {
    const _recursiveGetParent = (
      loadingService: LoadingService | null,
      acc: LoadingService[]
    ): LoadingService[] => {
      if (loadingService && loadingService.parent) {
        return _recursiveGetParent(
          loadingService.parent,
          acc.concat(loadingService.parent)
        );
      }
      return acc;
    };

    return _recursiveGetParent(this, []);
  }

  private getAllParentStates(): LoadingStore<PropertyTuple<PropertyKey>> {
    return this.getAllParents().reduce<
      LoadingStore<PropertyTuple<PropertyKey>>
    >((acc, parent) => {
      Object.entries(parent.state).forEach(([key, value]) => {
        acc[key] = value;
      });
      return acc;
    }, {});
  }
}