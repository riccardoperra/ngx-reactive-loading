import { LoadingStoreState, loadingStoreStateFactory } from './loading-state';
import {
  createLoadingStateFactory,
  withLoadingStateFactory,
} from './loading-factory';

export type LoadingRegistryState = LoadingStoreState;

export type ControlledLoadingRegistryState = LoadingRegistryState & {
  set: (isLoading: boolean) => void;
};

export const LOADING_REGISTRY_STATE_SYMBOL = Symbol('LOADING_REGISTRY_STATE');

export const buildLoadingRegistryState = () =>
  createLoadingStateFactory(
    LOADING_REGISTRY_STATE_SYMBOL,
    withLoadingStateFactory(loadingStoreStateFactory)
  );

export const CONTROLLED_LOADING_REGISTRY_STATE_SYMBOL = Symbol(
  'CONTROLLED_LOADING_REGISTRY_STATE'
);

export const buildControlledLoadingRegistryState =
  (): ControlledLoadingRegistryState =>
    createLoadingStateFactory(
      CONTROLLED_LOADING_REGISTRY_STATE_SYMBOL,
      withLoadingStateFactory(loadingStoreStateFactory, loadingSubject$ => ({
        set: (isLoading: boolean) => loadingSubject$.next(isLoading),
      }))
    );
