import { InjectionToken } from '@angular/core';
import { LoadingStoreService } from '../model/loading-store';
import { LoadingStoreOptions } from '../model/loading-store-options';

/**
 * @internal
 */
export const INITIAL_LOADING_STORE = new InjectionToken<PropertyKey[]>(
  '[ngx-reactive-loading] Loading store initial value'
);

/**
 * @internal
 */
export const LOADING_STORE = new InjectionToken<LoadingStoreService>(
  '[ngx-reactive-loading] Loading Store'
);

/**
 * @internal
 */
export const LOADING_STORE_OPTIONS = new InjectionToken<LoadingStoreOptions>(
  '[ngx-reactive-loading] Loading store options'
);

/**
 * @internal
 */
export const ROOT_LOADING_STORE = new InjectionToken<LoadingStoreService>(
  '[ngx-reactive-loading] Root loading store'
);

/**
 * @internal
 */
export const FEATURE_LOADING_STORE = new InjectionToken<LoadingStoreService>(
  '[ngx-reactive-loading] Feature loading store'
);

/**
 * @internal
 */
export const ROOT_LOADING_STORE_GUARD = new InjectionToken<void>(
  '[ngx-reactive-loading] Internal root guard'
);

/**
 * @internal
 */
export const PARENT_LOADING_STORE = new InjectionToken<LoadingStoreService>(
  '[ngx-reactive-loading] Parent loading store'
);
