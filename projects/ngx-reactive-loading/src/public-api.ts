/*
 * Public API Surface of ngx-reactive-loading
 */

export { LoadingEvent, LoadingRegistry } from './lib/model';
export { withLoading } from './lib/operators';
export { someLoading, toLoadingEvent, untilLoading } from './lib/utils';
export {
  createLoadingStore,
  createLoadingRegistry,
  LoadingStore,
} from './lib/core';
export { LoadingService } from './lib/services';
export { ReactiveLoadingModule } from './lib/reactive-loading.module';
export { SOME_LOADING, LOADING_REGISTRY } from './lib/providers/token';
export { LoadingDirective } from './lib/components/loading.directive';
export {
  HTTP_LOADING_REGISTRY,
  HttpLoadingRegistryInterceptor,
  putLoadingContext,
} from './lib/interceptors/http-loading-registry.interceptor';
