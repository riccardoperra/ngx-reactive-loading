import {
  Inject,
  Injectable,
  InjectionToken,
  OnDestroy,
  Optional,
  TypeProvider,
  ValueProvider,
} from '@angular/core';
import {
  defer,
  merge,
  MonoTypeOperatorFunction,
  Observable,
  pipe,
  Subject,
} from 'rxjs';
import { LoadingStore, LoadingStoreState } from '../model/loading';
import { createLoadingStore } from '../utils/create-loading-store';
import { map, shareReplay, skip, takeUntil } from 'rxjs/operators';
import { someLoading } from '../operators/some-loading';
import { LoadingEvent } from '../model/loading-event';

const INITIAL_LOADING_STORE = new InjectionToken<PropertyKey[]>(
  'ngx-reactive-loading/loading-store/initial-value'
);

type PropertyTuple<T extends PropertyKey> = readonly [...T[]];

export const provideLoadingService = <T extends PropertyKey>(
  keys: PropertyTuple<T>
): [initialLoading: ValueProvider, typeProvider: TypeProvider] => {
  return [
    {
      provide: INITIAL_LOADING_STORE,
      useValue: keys,
    },
    LoadingService,
  ];
};

@Injectable({ providedIn: 'root' })
export class LoadingService<T extends PropertyKey = PropertyKey>
  implements OnDestroy
{
  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly initializedErrorMessage = `[${this.constructor.name}] Loading state already initialized`;
  private readonly notInitializedErrorMessage = `[${this.constructor.name}] Loading state is not initialized yet`;
  state: LoadingStore<PropertyTuple<T>>;
  isInitialized: boolean = false;

  readonly events$: Observable<LoadingEvent> = defer(() => {
    const entries = Object.entries<LoadingStoreState>(this.state);
    const events$ = entries.map(([type, state]) =>
      state.loading$.pipe(map(isLoading => ({ type, loading: isLoading })))
    );
    const entriesLength = entries.length;
    return merge(...events$).pipe(skip(entriesLength));
  }).pipe(
    shareReplay({ refCount: true, bufferSize: 1 }),
    takeUntil(this.destroy$)
  );

  constructor(
    @Inject(INITIAL_LOADING_STORE)
    defaultValue: PropertyTuple<T>
  ) {
    this.state = createLoadingStore(defaultValue);
    this.isInitialized = true;
  }

  load<S>(source: () => Observable<S>, trackBy: T): Observable<S> {
    return defer(() => {
      if (!this.state) {
        throw new Error(this.initializedErrorMessage);
      }
      return source().pipe(this.state[trackBy].track());
    });
  }

  track<O>(identifier: T): MonoTypeOperatorFunction<O> {
    if (!this.state) {
      throw new Error(this.notInitializedErrorMessage);
    }

    const loadingStoreState = this.state[identifier];

    if (!loadingStoreState) {
      return pipe();
    }

    return loadingStoreState.track();
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
      const loadingState = this.state[identifier];
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
}
