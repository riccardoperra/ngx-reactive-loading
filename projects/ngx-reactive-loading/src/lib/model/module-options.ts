import { LoadingStoreOptions } from './loading-store-options';

export interface LoadingStoreModuleOptions extends LoadingStoreOptions {
  /**
   * When true, log all loading state changes to the console.
   * Use for debugging.
   */
  logger?: boolean;
  /**
   * The name of the provider. Useful for named logs.
   */
  name?: string;
}
