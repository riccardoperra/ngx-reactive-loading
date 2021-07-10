import { MonoTypeOperatorFunction, Observable } from 'rxjs';

export type LoadingStoreState = {
  readonly loading$: Observable<boolean>;
  readonly track: <T>() => MonoTypeOperatorFunction<T>;
};

export type LoadingStore<K extends readonly [...PropertyKey[]]> = {
  [Key in K[number]]: Readonly<LoadingStoreState>;
};
