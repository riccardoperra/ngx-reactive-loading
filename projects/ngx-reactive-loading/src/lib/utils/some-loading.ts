import {
  combineLatest,
  isObservable,
  Observable,
  distinctUntilChanged,
  map,
  shareReplay,
} from 'rxjs';
import { isLoadingStore, LoadingStore } from '../core/create-loading-store';
import { isLoadingStoreState, LoadingStoreState } from '../internal/factory';

export const someLoading = <
  Loaders extends readonly [
    ...(readonly (
      | LoadingStore<readonly PropertyKey[]>
      | LoadingStoreState
      | Observable<boolean>
    )[])
  ]
>(
  loaders: Loaders
) => {
  const loaders$: Observable<boolean>[] = loaders.reduce<Observable<boolean>[]>(
    (acc, loader) => {
      if (isObservable(loader)) {
        return acc.concat(loader);
      }
      if (isLoadingStoreState(loader)) {
        return acc.concat(loader.$);
      }
      if (isLoadingStore(loader)) {
        return acc.concat(Object.values(loader).map(state => state.$));
      }
      return acc;
    },
    []
  );

  return combineLatest(loaders$).pipe(
    map(loaders => loaders.some(loader => loader)),
    distinctUntilChanged(),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
};
