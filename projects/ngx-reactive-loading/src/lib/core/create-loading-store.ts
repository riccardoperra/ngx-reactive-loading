import {
  buildLoadingStoreState,
  isLoadingStoreState,
  LoadingStoreState,
} from '../internal/factory';

/**
 * @description
 * Creates a LoadingStore object with the given keys.
 *
 * Each loading state will store a loading subject which will be updated automatically
 * and a track function which must be attached in an observable stream.
 *
 * @param keys The keys of the loading store that will be tracked
 */
export const createLoadingStore = <LoadingKeys extends readonly PropertyKey[]>(
  keys: readonly [...LoadingKeys]
): LoadingStore<LoadingKeys> => {
  const stores = {} as LoadingStore<LoadingKeys>;
  for (const key of keys) {
    stores[key] = buildLoadingStoreState();
  }
  return stores;
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

export type LoadingStore<K extends readonly [...PropertyKey[]]> = {
  [Key in K[number]]: Readonly<LoadingStoreState>;
};
