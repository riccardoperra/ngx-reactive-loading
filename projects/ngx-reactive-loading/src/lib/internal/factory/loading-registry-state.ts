import { LoadingStoreState, loadingStoreStateFactory } from './loading-state';
import {
  createLoadingStateFactory,
  withLoadingStateFactory,
} from './loading-factory';

export type LoadingRegistryState = LoadingStoreState;

export type ControlledLoadingRegistryState = LoadingRegistryState & {
  set: (isLoading: boolean) => void;
};

/**
 * @internal
 */
export const LOADING_REGISTRY_STATE_SYMBOL = Symbol('LOADING_REGISTRY_STATE');

/**
 * @internal
 */
export const buildLoadingRegistryState = () =>
  createLoadingStateFactory(
    LOADING_REGISTRY_STATE_SYMBOL,
    withLoadingStateFactory(loadingStoreStateFactory)
  );

/**
 * @internal
 */
export const CONTROLLED_LOADING_REGISTRY_STATE_SYMBOL = Symbol(
  'CONTROLLED_LOADING_REGISTRY_STATE'
);

/**
 * @internal
 */
export const buildControlledLoadingRegistryState =
  (): ControlledLoadingRegistryState =>
    createLoadingStateFactory(
      CONTROLLED_LOADING_REGISTRY_STATE_SYMBOL,
      withLoadingStateFactory(loadingStoreStateFactory, loadingSubject$ => ({
        set: (isLoading: boolean) => loadingSubject$.next(isLoading),
      }))
    );
