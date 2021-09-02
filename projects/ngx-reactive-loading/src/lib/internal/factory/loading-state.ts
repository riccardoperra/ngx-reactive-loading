import { MonoTypeOperatorFunction } from 'rxjs';
import {
  createLoadingStateFactory,
  LoadingFactory,
  LoadingFactoryState,
  withLoadingStateFactory,
} from './loading-factory';
import { withLoading } from '../../operators';

export type LoadingStoreStateFactory = {
  readonly track: <T>() => MonoTypeOperatorFunction<T>;
};

/**
 * @internal
 */
export const LOADING_STORE_STATE_SYMBOL = Symbol('LOADING_STORE_STATE');

export type LoadingStoreState = LoadingFactoryState<symbol> &
  LoadingStoreStateFactory;

/**
 * @internal
 */
export const loadingStoreStateFactory: LoadingFactory<LoadingStoreStateFactory> =
  loadingSubject$ => ({
    track: <T>() => withLoading(loadingSubject$),
  });

/**
 * @internal
 */
export const buildLoadingStoreState = (): LoadingStoreState =>
  createLoadingStateFactory(
    LOADING_STORE_STATE_SYMBOL,
    withLoadingStateFactory(loadingStoreStateFactory)
  );

/**
 * @internal
 */
export const isLoadingStoreState = (
  value: unknown
): value is LoadingStoreState => {
  return (
    (value as Partial<LoadingStoreState>)?.type === LOADING_STORE_STATE_SYMBOL
  );
};
