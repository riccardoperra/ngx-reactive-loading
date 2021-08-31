import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { asapScheduler, defer, Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { createLoadingRegistry } from '../core';
import { LoadingRegistry } from '../model';

const LOADING_DEFAULT_CONTEXT =
  '[ngx-reactive-loading/loading-store-interceptor/default]';

export const HTTP_LOADING_CONTEXT = new HttpContextToken<PropertyKey>(
  () => LOADING_DEFAULT_CONTEXT
);

export const HTTP_LOADING_REGISTRY = new InjectionToken<LoadingRegistry>(
  '[ngx-reactive-loading] HttpLoadingRegistry',
  {
    providedIn: 'root',
    factory: createLoadingRegistry,
  }
);

export const putLoadingContext = (key: PropertyKey) =>
  new HttpContext().set(HTTP_LOADING_CONTEXT, key);

@Injectable()
export class HttpLoadingRegistryInterceptor implements HttpInterceptor {
  requestCount: number = 0;

  constructor(
    @Inject(HTTP_LOADING_REGISTRY)
    private readonly loadingRegistry: LoadingRegistry
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
        this.requestCount++;
        return next.handle(request).pipe(
          this.loadingRegistry.track(loadingContext),
          finalize(() =>
            asapScheduler.schedule(() => {
              this.loadingRegistry.delete(loadingContext);
              this.requestCount--;
            })
          )
        );
      });
    }

    return next.handle(request);
  }

  private getContext(request: HttpRequest<unknown>): PropertyKey {
    return request.context.get(HTTP_LOADING_CONTEXT);
  }
}
