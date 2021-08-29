import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { LoadingStoreState } from './loading';

export type LoadingRegistry<K extends PropertyKey = PropertyKey> = {
  readonly get: (key: K) => LoadingStoreState | null;
  readonly add: (key: K) => void;
  readonly addAll: (keys: K[]) => void;
  readonly delete: (key: K) => boolean;
  readonly someLoading: (keys: K[]) => Observable<boolean>;
  readonly isLoading: (key: K) => Observable<boolean>;
  readonly track: <O>(key: K) => MonoTypeOperatorFunction<O>;
  readonly registry$: Observable<{ [key in PropertyKey]: boolean }>;
  readonly destroy: () => void;
  readonly keys: () => K[];
};
