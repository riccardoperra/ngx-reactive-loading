import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HttpClient,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  HttpLoadingRegistryInterceptor,
  HTTP_LOADING_CONTEXT,
  HTTP_LOADING_REGISTRY,
  putLoadingContext,
} from '../../lib/interceptors/http-loading-registry.interceptor';
import { Injectable } from '@angular/core';
import { catchError, delay, mapTo, take } from 'rxjs/operators';
import { Observable, of, ReplaySubject } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { createLoadingRegistry, LoadingRegistry } from '../../public-api';

describe(`HttpLoadingRegistryInterceptor`, () => {
  const registry: LoadingRegistry = createLoadingRegistry();

  const interceptor: HttpLoadingRegistryInterceptor =
    new HttpLoadingRegistryInterceptor(registry);
  it(
    'should update',
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
});
