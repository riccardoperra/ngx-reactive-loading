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
import { map, shareReplay, skip, takeUntil } from 'rxjs/operators';
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
   * Track the changes of the current loading store state excluding the parent states.
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
   * Static method to easily provide the LoadingService into the component providers
   */
  static componentProvider<T extends PropertyKey>(
    keys: PropertyTuple<T>,
    options?: { standalone: boolean }
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

  load<S>(source$: Observable<S>, track: T): Observable<S> {
    return defer(() => {
      if (!this.state) {
        throw new Error(this.initializedErrorMessage);
      }
      return source$.pipe(this.state[track].track());
    });
  }

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

  isLoading(key: T): Observable<boolean> {
    return this.someLoading([key]);
  }

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
