import {
  combineLatest,
  MonoTypeOperatorFunction,
  of,
  pipe,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs';
import {
  ControlledLoadingRegistry,
  LoadingRegistry,
  PropertyTuple,
} from '../model';
import { someLoading as internalSomeLoading } from '../utils/some-loading';
import { ReactiveMap } from '../internal/reactive-map';
import {
  buildControlledLoadingRegistryState,
  buildLoadingRegistryState,
  LoadingRegistryState,
} from '../internal/factory';

const createLoadingRegistryFactory = <
  T extends PropertyKey,
  FactoryState extends LoadingRegistryState
>(
  initialKeys: PropertyTuple<T>,
  factory: () => FactoryState
) => {
  const registry = new ReactiveMap<T, FactoryState>();

  registry.setMany(initialKeys.map(key => [key, factory()]));

  const registry$ = registry.changes$.pipe(
    switchMap(sources => {
      const keys = Array.from(sources.keys());
      const values = Array.from(sources.values()).map(state => state.$);
      if (keys.length === 0 && values.length === 0) {
        return of({});
      }
      return combineLatest(values).pipe(
        map(values =>
          values.reduce(
            (acc, value, index) => ({
              ...acc,
              [keys[index]]: value,
            }),
            {}
          )
        )
      );
    })
  );

  const someLoading = (keys: T[]) =>
    registry.changes$.pipe(
      switchMap(_ => {
        const sources$ = _.getMany(keys)
          .filter((value): value is NonNullable<FactoryState> => !!value)
          .map(state => state.$);
        return sources$.length > 0 ? internalSomeLoading(sources$) : of(false);
      }),
      distinctUntilChanged()
    );

  const isLoading = (key: T) => someLoading([key]);

  const track = <O>(key: T): MonoTypeOperatorFunction<O> =>
    pipe(source => {
      const state = registry.get(key);
      if (state) {
        return state.track<O>()(source);
      }
      return source;
    });

  const keys = () => Array.from(registry.keys());

  const destroyByKeys = (keys: T[]) => {
    const state = registry
      .getMany(keys)
      .filter((value): value is NonNullable<FactoryState> => !!value);
    state.forEach(key => key.destroy());
  };

  const destroyAll = () => {
    destroyByKeys(keys());
    registry.clear();
  };

  const deleteByKey = (key: T) => {
    destroyByKeys([key]);
    return registry.delete(key);
  };

  return {
    registry$,
    someLoading,
    isLoading,
    track,
    get: (key: T) => registry.get(key) ?? null,
    add: (key: T) => void registry.set(key, factory()),
    addAll: (keys: T[]) => registry.setMany(keys.map(k => [k, factory()])),
    delete: deleteByKey,
    destroy: destroyAll,
    keys,
  };
};

/**
 * @description
 * Creates a LoadingRegistry object.
 * The loading registry is a key value storage that can holds dynamically the loading states of your application.
 *
 * @param initialKeys Default keys
 */
export const createLoadingRegistry = <T extends PropertyKey = PropertyKey>(
  initialKeys: PropertyTuple<T> = []
): LoadingRegistry<T> =>
  createLoadingRegistryFactory(initialKeys, buildLoadingRegistryState);

/**
 * @description
 * Creates a ControlledLoadingRegistry object.
 * The controlled loading registry is a loading registry with the ability
 * to update a loading state by key programmatically.
 *
 * @param initialKeys Default keys
 */
export const createControlledLoadingRegistry = <
  T extends PropertyKey = PropertyKey
>(
  initialKeys: PropertyTuple<T> = []
): ControlledLoadingRegistry<T> =>
  createLoadingRegistryFactory(
    initialKeys,
    buildControlledLoadingRegistryState
  );
