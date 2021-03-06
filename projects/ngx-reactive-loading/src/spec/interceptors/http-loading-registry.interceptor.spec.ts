import {
  HTTP_INTERCEPTORS,
  HttpContext,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { HttpLoadingRegistryInterceptor } from '../../lib/http/http-loading-registry.interceptor';
import { merge, Observable, of, ReplaySubject, delay, map } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { ControlledLoadingRegistry } from '../../lib/model';
import { createControlledLoadingRegistry } from '../../lib/core/create-loading-registry';
import { TestBed } from '@angular/core/testing';
import { HTTP_LOADING_REGISTRY } from '../../lib/http/http-loading-registry';
import { withHttpLoadingContext } from '../../lib/http/http-loading-context';

describe(`HttpLoadingRegistryInterceptor`, () => {
  const registry: ControlledLoadingRegistry = createControlledLoadingRegistry();

  const interceptor: HttpLoadingRegistryInterceptor =
    new HttpLoadingRegistryInterceptor(registry);

  it('should initialize module and http loading registry', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          multi: true,
          useClass: HttpLoadingRegistryInterceptor,
        },
      ],
    });

    const loadingRegistry = TestBed.inject(HTTP_LOADING_REGISTRY);
    expect(loadingRegistry).toBeTruthy();
  });

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
        context: withHttpLoadingContext('testKey'),
      } as HttpRequest<any>;

      const destination$ = interceptor
        .intercept(httpRequestStub, next)
        .pipe(map(() => true));

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
        .pipe(map(() => true));

      m.expect(destination$).toBeObservable('(a|)', { a: true });
      m.equal(replaySubject$, 'a', { a: {} });
    })
  );

  it(
    'should no recreate state if exists',
    marbles(m => {
      const source$ = new ReplaySubject(1);
      const registry$ = new ReplaySubject(0);
      registry.isLoading('test1').subscribe(source$);
      registry.registry$.subscribe(registry$);

      const next: HttpHandler = {
        handle: () => m.cold('----(a|)', { a: true }) as Observable<any>,
      };

      const httpRequestStub: HttpRequest<any> = {
        url: '/',
        context: withHttpLoadingContext('test1'),
      } as HttpRequest<any>;

      const destination$ = merge(
        interceptor.intercept(httpRequestStub, next).pipe(
          delay(1),
          map(() => true)
        ),
        interceptor.intercept(httpRequestStub, next).pipe(
          delay(4),
          map(() => false)
        )
      );

      m.expect(destination$).toBeObservable('-----a--(b|)', {
        a: true,
        b: false,
      });
      m.expect(source$).toBeObservable('a---b', {
        a: true,
        b: false,
      });
      m.expect(registry$).toBeObservable('a---(bc)', {
        a: { test1: true },
        b: { test1: false },
        c: {},
      });
    })
  );
});
