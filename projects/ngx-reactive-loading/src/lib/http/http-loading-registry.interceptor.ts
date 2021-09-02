import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { ControlledLoadingRegistry } from '../model';
import {
  HTTP_LOADING_CONTEXT,
  LOADING_DEFAULT_CONTEXT,
} from './http-loading-context';
import { HTTP_LOADING_REGISTRY } from './http-loading-registry';

@Injectable()
export class HttpLoadingRegistryInterceptor implements HttpInterceptor {
  private readonly requestMap: Map<PropertyKey, number> = new Map<
    PropertyKey,
    number
  >();

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
