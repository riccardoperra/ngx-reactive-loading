import {
  isLoadingStore,
  isLoadingStoreState,
  LoadingStore,
  LoadingStoreState,
} from '../model';
import { combineLatest, isObservable, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';

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
        return acc.concat(loader.loading$);
      }
      if (isLoadingStore(loader)) {
        return acc.concat(Object.values(loader).map(state => state.loading$));
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
