import {
  ExistingProvider,
  FactoryProvider,
  InjectionToken,
  Injector,
  Provider,
  ValueProvider,
} from '@angular/core';
import { PropertyTuple } from '../model/property';
import {
  INITIAL_LOADING_STORE,
  LOADING_STORE_OPTIONS,
  PARENT_LOADING_STORE,
} from './token';
import { LoadingStoreOptions } from '../model/loading-store-options';
import { LoadingService } from '../services';

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
    provideParentLoadingStore,
    LoadingService,
  ];
};

/**
 * @internal
 */
export const provideParentLoadingStore: FactoryProvider = {
  provide: PARENT_LOADING_STORE,
  useFactory: (injector: Injector, options: LoadingStoreOptions) => {
    if (options.standalone) {
      return null;
    }
    return injector.get(LoadingService, null);
  },
  deps: [Injector, LOADING_STORE_OPTIONS],
};

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

export const provideExistingLoadingStore = (
  token: InjectionToken<LoadingService>
): ExistingProvider => ({
  provide: token,
  useExisting: LoadingService,
});
