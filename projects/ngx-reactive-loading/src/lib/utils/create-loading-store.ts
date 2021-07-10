import { BehaviorSubject } from 'rxjs';
import { withLoading } from '../operators/with-loading';
import { LoadingStore, LoadingStoreState } from '../model/loading';

function buildLoadingState(): LoadingStoreState {
  const loadingSubject = new BehaviorSubject<boolean>(false);
  return {
    loading$: loadingSubject.asObservable(),
    track: <T>() => withLoading(loadingSubject),
  };
}

export const createLoadingStore = <LoadingKeys extends readonly PropertyKey[]>(
  keys: readonly [...LoadingKeys]
): LoadingStore<LoadingKeys> => {
  const stores = {} as LoadingStore<LoadingKeys>;
  keys.forEach(key => (stores[key] = buildLoadingState()));
  return stores;
};
