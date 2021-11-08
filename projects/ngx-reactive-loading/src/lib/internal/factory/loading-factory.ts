import {
  BehaviorSubject,
  Observable,
  Subject,
  shareReplay,
  takeUntil,
} from 'rxjs';
import { Merge, UnionToIntersection } from './merge';

/**
 *
 * @internal
 * @param type
 * @param factory
 */
export const createLoadingStateFactory = <
  Type extends PropertyKey,
  FactoryReturn extends {}
>(
  type: Type,
  factory: LoadingFactory<FactoryReturn>
): LoadingFactoryState<Type> & FactoryReturn => {
  const loadingSubject$ = new BehaviorSubject<boolean>(false);
  const destroy$ = new Subject<void>();

  const destroyFn = () => {
    destroy$.next();
    destroy$.complete();
  };

  return {
    $: loadingSubject$
      .asObservable()
      .pipe(
        shareReplay({ refCount: true, bufferSize: 1 }),
        takeUntil(destroy$)
      ),
    type,
    destroy: destroyFn,
    ...factory(loadingSubject$, destroy$),
  };
};

/**
 *
 * @internal
 * @param factories
 */
export const withLoadingStateFactory = <
  R extends readonly Record<string, unknown>[]
>(
  ...factories: LoadingFactoryTuple<R>
): LoadingFactory<Merge<R>> => {
  return (loading, destroy$) =>
    factories.reduce<{}>(
      (acc, factory) => ({
        ...acc,
        ...factory(loading, destroy$),
      }),
      {}
    ) as UnionToIntersection<R[number]>;
};

export type LoadingFactoryState<Type extends PropertyKey> = {
  $: Observable<boolean>;
  type: Type;
  destroy: () => void;
};

/**
 * @internal
 */
export type LoadingFactoryTuple<T extends {}> = {
  [K in keyof T]: LoadingFactory<T[K]>;
};

/**
 * internal
 */
export type LoadingFactory<R> = (
  context: BehaviorSubject<boolean>,
  destroy$: Subject<void>
) => R;
