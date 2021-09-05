import {
  Inject,
  Injectable,
  OnDestroy,
  Optional,
  Provider,
  SkipSelf,
} from '@angular/core';
import { defer, MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import { LoadingEvent, LoadingStoreOptions, PropertyTuple } from '../model';
import { someLoading, toLoadingEvent } from '../utils';
import { distinctUntilChanged, shareReplay, takeUntil } from 'rxjs/operators';
import { LoadingStoreService } from '../model/loading-store';
import {
  INITIAL_LOADING_STORE,
  LOADING_STORE,
  LOADING_STORE_OPTIONS,
  PARENT_LOADING_STORE,
} from '../internal/tokens';
import {
  provideInitialLoadingState,
  provideLoadingStoreOptions,
  provideParentLoadingStore,
  provideSomeLoadingState,
} from '../internal/providers';
import { createLoadingStore, LoadingStore } from '../core';
import { LoadingStoreState } from '../internal/factory';

/**
 * @internal
 * @param keys Loading store property keys
 * @param options Loading store options
 */
export const provideLoadingService = <T extends PropertyKey>(
  keys: PropertyTuple<T>,
  options?: LoadingStoreOptions
): Provider[] => {
  const defaultComponentProvider: LoadingStoreOptions = { standalone: false };
  return [
    provideInitialLoadingState(keys),
    provideLoadingStoreOptions(options || defaultComponentProvider),
    provideParentLoadingStore(),
    LoadingService,
    {
      provide: LOADING_STORE,
      useExisting: LoadingService,
    },
    provideSomeLoadingState(),
  ];
};

@Injectable()
export class LoadingService<T extends PropertyKey = PropertyKey>
  implements OnDestroy, LoadingStoreService<T>
{
  /**
   * @internal
   * @private
   * Destroy subject to unsubscribe automatically all subscriptions if service is provided in component.
   */
  private readonly destroy$: Subject<void> = new Subject<void>();

  /**
   * The loading store state.
   */
  readonly state: LoadingStore<PropertyTuple<T>>;

  /**
   * Track all changes of each current LoadingService loading state property.
   */
  readonly events$: Observable<LoadingEvent>;

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
    @Inject(INITIAL_LOADING_STORE)
    private readonly defaultValue: PropertyTuple<T>,
    @Inject(LOADING_STORE_OPTIONS)
    private readonly options: LoadingStoreOptions,
    @Inject(PARENT_LOADING_STORE)
    @Optional()
    @SkipSelf()
    private readonly parent: LoadingService | null
  ) {
    this.verifyStoreKeys();
    this.state = createLoadingStore(defaultValue);
    this.events$ = toLoadingEvent(this.state);
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
    return defer(() => source$.pipe(this.track(property)));
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
   *      .pipe(this.loadingService.track("add"))
   *      .subscribe();
   *   }
   * }
   * ```
   */
  track<O>(key: T): MonoTypeOperatorFunction<O> {
    const loadingStoreState = this.state[key];

    if (!loadingStoreState) {
      throw new Error(`[LoadingService] Property ${key.toString()} not found`);
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
   *   readonly isAdd$: Observable<boolean> = this.loadingService.isLoading("add");
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
    const stores: LoadingStoreState[] = [];
    const sanitizedIdentifiers = identifiers.filter(Boolean);

    for (const identifier of sanitizedIdentifiers) {
      const loadingState =
        this.state[identifier] || this.getAllParentStates()[identifier];

      if (!loadingState) {
        throw new Error(
          `[LoadingService] Property ${identifier.toString()} not found`
        );
      }
      stores.push(loadingState);
    }

    return stores;
  }

  /**
   * Used to automatically unsubscribe all
   * subscribers (only if service is provided attached in a Component)
   */
  ngOnDestroy(): void {
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

  private verifyStoreKeys(): void {
    const serviceKeys = ([] as PropertyKey[]).concat(this.defaultValue);
    const duplicateKey = serviceKeys.find(
      (key, i, arr) => arr.indexOf(key) !== arr.lastIndexOf(key)
    );

    if (!!duplicateKey) {
      throw new Error(
        `Key '${duplicateKey.toString()}' cannot be duplicated in the current service.`
      );
    }

    const parentKeys = this.getAllParents().reduce<PropertyKey[]>(
      (acc, parent) => [...acc, ...parent.defaultValue],
      []
    );

    const parentStateDuplicateKey = parentKeys.find(key =>
      serviceKeys.includes(key)
    );

    if (parentStateDuplicateKey) {
      throw new Error(
        `Key '${parentStateDuplicateKey.toString()}' is already defined by a parent service.`
      );
    }
  }
}
