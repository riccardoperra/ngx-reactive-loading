import { InjectionToken, TypeProvider, ValueProvider } from '@angular/core';
import { LoadingService } from './loading.service';
import { PropertyTuple } from '../model/property';

export const INITIAL_LOADING_STORE = new InjectionToken<PropertyKey[]>(
  'ngx-reactive-loading/loading-store/initial-value'
);

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
