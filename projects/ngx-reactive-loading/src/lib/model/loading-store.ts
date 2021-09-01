import { PropertyTuple } from './property';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { LoadingEvent } from './loading-event';
import { LoadingStore } from '../core';

export interface LoadingStoreService<T extends PropertyKey = PropertyKey> {
  readonly state: LoadingStore<PropertyTuple<T>>;

  readonly events$: Observable<LoadingEvent>;

  load<S>(source: Observable<S>, property: T): Observable<S>;

  track<O>(key: T): MonoTypeOperatorFunction<O>;

  isLoading(key: T): Observable<boolean>;

  someLoading(identifier?: PropertyTuple<T>): Observable<boolean>;
}
