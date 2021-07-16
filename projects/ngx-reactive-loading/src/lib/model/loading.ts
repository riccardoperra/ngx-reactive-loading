import { isObservable, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { isFunction } from 'rxjs/internal-compatibility';

export type LoadingStoreState = {
  readonly $: Observable<boolean>;
  readonly track: <T>() => MonoTypeOperatorFunction<T>;
};

export type LoadingStore<K extends readonly [...PropertyKey[]]> = {
  [Key in K[number]]: Readonly<LoadingStoreState>;
};

export const isLoadingStoreState = (
  value: unknown
): value is LoadingStoreState => {
  return (
    typeof value === 'object' &&
    !!value &&
    '$' in value &&
    isObservable((value as Partial<LoadingStoreState>).$) &&
    isFunction((value as Partial<LoadingStoreState>).track)
  );
};

export const isLoadingStore = (
  value: unknown
): value is LoadingStore<PropertyKey[]> => {
  return (
    typeof value === 'object' &&
    !!value &&
    Object.values(value).every(value => isLoadingStoreState(value))
  );
};
