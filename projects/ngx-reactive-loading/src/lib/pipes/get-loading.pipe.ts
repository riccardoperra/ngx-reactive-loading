import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { isLoadingStore, LoadingStore } from '../core/create-loading-store';
import { LoadingRegistry, PropertyTuple } from '../model';
import { someLoading } from '../utils';

@Pipe({
  name: 'getLoading',
})
export class GetLoadingPipe implements PipeTransform {
  transform<T extends PropertyKey>(
    value: LoadingStore<PropertyTuple<T>>,
    properties: PropertyTuple<T> | T
  ): Observable<boolean>;
  transform<T extends PropertyKey>(
    value: LoadingRegistry<T>,
    properties: T | PropertyTuple<T>
  ): Observable<boolean>;
  transform<T extends PropertyKey>(
    value: LoadingStore<PropertyTuple<T>> | LoadingRegistry<T>,
    properties: T | PropertyTuple<T>
  ): Observable<boolean> {
    const keys = Array.isArray(properties) ? properties : [properties];
    const isValueLoadingStore = isLoadingStore(value);
    if (isValueLoadingStore) {
      return someLoading(keys.map(key => value[key as T].$));
    } else {
      return value.someLoading(keys as T[]);
    }
  }
}
