import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ControlledLoadingRegistry, LoadingRegistry } from '../model';
import { createControlledLoadingRegistry } from '../core/create-loading-registry';

const LOADING_DEFAULT_CONTEXT =
  '[ngx-reactive-loading/loading-store-interceptor/default]';

export const HTTP_LOADING_CONTEXT = new HttpContextToken<PropertyKey>(
  () => LOADING_DEFAULT_CONTEXT
);

export const HTTP_LOADING_REGISTRY = new InjectionToken<LoadingRegistry>(
  '[ngx-reactive-loading] HttpLoadingRegistry',
  {
    providedIn: 'root',
    factory: createControlledLoadingRegistry,
  }
);

export const putLoadingContext = (key: PropertyKey) =>
  new HttpContext().set(HTTP_LOADING_CONTEXT, key);

@Injectable()
export class HttpLoadingRegistryInterceptor implements HttpInterceptor {
  requestMap: Map<PropertyKey, number> = new Map<PropertyKey, number>();

  constructor(
    @Inject(HTTP_LOADING_REGISTRY)
    private readonly loadingRegistry: ControlledLoadingRegistry
  ) {}

  intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    const loadingContext = this.getContext(request);

    if (loadingContext !== LOADING_DEFAULT_CONTEXT) {
      if (!this.loadingRegistry.keys().includes(loadingContext)) {
        this.loadingRegistry.add(loadingContext);
      }

      return defer(() => {
        this.addRequest(loadingContext);

        if (this.getRequest(loadingContext) === 1) {
          this.loadingRegistry.get(loadingContext)!.set(true);
        }

        return next.handle(request).pipe(
          finalize(() => {
            this.endRequest(loadingContext);
            if (this.getRequest(loadingContext) === 0) {
              this.loadingRegistry.get(loadingContext)!.set(false);
              this.loadingRegistry.delete(loadingContext);
            }
          })
        );
      });
    }

    return next.handle(request);
  }

  private getContext(request: HttpRequest<unknown>): PropertyKey {
    return request.context.get(HTTP_LOADING_CONTEXT);
  }

  getRequest(context: PropertyKey): number {
    return this.requestMap.get(context) || 0;
  }

  private addRequest(context: PropertyKey): void {
    this.requestMap.set(context, (this.requestMap.get(context) ?? 0) + 1);
  }

  private endRequest(context: PropertyKey): void {
    this.requestMap.set(context, this.requestMap.get(context)! - 1);
  }
}
