import { LoadingStore } from '../model';
import { buildLoadingState } from './build-loading-state';

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
    stores[key] = buildLoadingState();
  }
  return stores;
};
