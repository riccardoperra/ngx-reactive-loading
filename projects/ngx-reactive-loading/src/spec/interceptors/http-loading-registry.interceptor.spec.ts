import { HttpContext, HttpHandler, HttpRequest } from '@angular/common/http';
import {
  HttpLoadingRegistryInterceptor,
  putLoadingContext,
} from '../../lib/interceptors/http-loading-registry.interceptor';
import { mapTo } from 'rxjs/operators';
import { Observable, of, ReplaySubject } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { createLoadingRegistry, LoadingRegistry } from '../../public-api';

describe(`HttpLoadingRegistryInterceptor`, () => {
  const registry: LoadingRegistry = createLoadingRegistry();

  const interceptor: HttpLoadingRegistryInterceptor =
    new HttpLoadingRegistryInterceptor(registry);

  it(
    'should update loading',
    marbles(m => {
      const replaySubject$ = new ReplaySubject();
      registry.registry$.subscribe(replaySubject$);

      const next: HttpHandler = {
        handle: () => m.cold('-----a|', { a: true }) as Observable<any>,
      };

      const httpRequestStub: HttpRequest<any> = {
        url: '/',
        context: putLoadingContext('testKey'),
      } as HttpRequest<any>;

      const destination$ = interceptor
        .intercept(httpRequestStub, next)
        .pipe(mapTo(true));

      m.expect(destination$).toBeObservable('-----a|', { a: true });
      m.equal(replaySubject$, '(abc)-(de)', {
        a: {},
        b: { testKey: false },
        c: { testKey: true },
        d: { testKey: false },
        e: {},
      });
    })
  );

  it(
    'should no update and create loading',
    marbles(m => {
      const replaySubject$ = new ReplaySubject();
      registry.registry$.subscribe(replaySubject$);

      const next: HttpHandler = {
        handle: () => of(true) as Observable<any>,
      };

      const httpRequestStub: HttpRequest<any> = {
        url: '/',
        context: new HttpContext(),
      } as HttpRequest<any>;

      const destination$ = interceptor
        .intercept(httpRequestStub, next)
        .pipe(mapTo(true));

      m.expect(destination$).toBeObservable('(a|)', { a: true });
      m.equal(replaySubject$, 'a', { a: {} });
    })
  );
});
