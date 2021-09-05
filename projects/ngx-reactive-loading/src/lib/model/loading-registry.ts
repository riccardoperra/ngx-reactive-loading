import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import {
  ControlledLoadingRegistryState,
  LoadingRegistryState,
} from '../internal/factory';

export interface LoadingRegistry<K extends PropertyKey = PropertyKey> {
  /**
   * Get loading state object
   */
  readonly get: (key: K) => LoadingRegistryState | null;
  /**
   * Add loading state by given key
   */
  readonly add: (key: K) => void;
  /**
   * Add loading states by given keys
   */
  readonly addAll: (keys: K[]) => void;
  /**
   * Delete a loading state by given key
   */
  readonly delete: (key: K) => boolean;
  /**
   * Observe the changes of a loading state by multiple keys and check if one of the given keys is loading.
   */
  readonly someLoading: (keys: K[]) => Observable<boolean>;
  /**
   * Observe the changes of a loading state by the given key
   */
  readonly isLoading: (key: K) => Observable<boolean>;
  /**
   * Operator function that will update the loading state when observable is subscribed
   */
  readonly track: <O>(key: K) => MonoTypeOperatorFunction<O>;
  /**
   * Observe the changes of all loading states. Value is emitted on state change, on add or on delete event;
   */
  readonly registry$: Observable<{ [key in PropertyKey]: boolean }>;
  /**
   * Clear the registry and unsubscribe all observables.
   */
  readonly destroy: () => void;
  /**
   * Get the current keys of registry
   */
  readonly keys: () => K[];
}

export interface ControlledLoadingRegistry<K extends PropertyKey = PropertyKey>
  extends LoadingRegistry<K> {
  /**
   * Get controlled loading state object
   */
  readonly get: (key: K) => ControlledLoadingRegistryState | null;
}
