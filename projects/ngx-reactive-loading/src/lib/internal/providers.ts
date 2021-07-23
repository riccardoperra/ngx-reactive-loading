import { LoadingStoreOptions, PropertyTuple } from '../model';
import { FactoryProvider, Injector, ValueProvider } from '@angular/core';
import { IS_LOADING, SOME_LOADING } from '../providers/token';
import { LoadingStoreService } from '../model/loading-store';
import {
  INITIAL_LOADING_STORE,
  LOADING_STORE,
  LOADING_STORE_OPTIONS,
  PARENT_LOADING_STORE,
} from './tokens';

/**
 * @internal
 * @param keys
 */
export const provideInitialLoadingState = <
  K extends PropertyKey,
  T extends PropertyTuple<K>
>(
  keys: T
): ValueProvider => ({
  provide: INITIAL_LOADING_STORE,
  useValue: keys,
});

/**
 * @internal
 * @param options
 */
export const provideLoadingStoreOptions = (options: LoadingStoreOptions) => ({
  provide: LOADING_STORE_OPTIONS,
  useValue: options,
});

/**
 * @internal
 */
export const provideParentLoadingStore: () => FactoryProvider = () => ({
  provide: PARENT_LOADING_STORE,
  useFactory: (injector: Injector, options: LoadingStoreOptions) => {
    if (options.standalone) {
      return null;
    }
    return injector.get(LOADING_STORE, null);
  },
  deps: [Injector, LOADING_STORE_OPTIONS],
});

/**
 * @internal
 */
export const provideSomeLoadingState: () => FactoryProvider = () => ({
  provide: SOME_LOADING,
  useFactory: (loadingService: LoadingStoreService) =>
    loadingService.someLoading(),
  deps: [LOADING_STORE],
});
