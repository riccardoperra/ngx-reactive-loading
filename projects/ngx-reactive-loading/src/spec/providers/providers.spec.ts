import { TestBed } from '@angular/core/testing';
import { defer, Observable, of } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { delay } from 'rxjs/operators';
import { provideSomeLoadingState } from '../../lib/internal/providers';
import {
  INITIAL_LOADING_STORE,
  LOADING_STORE,
  LOADING_STORE_OPTIONS,
  PARENT_LOADING_STORE,
} from '../../lib/internal/tokens';
import { LoadingService, SOME_LOADING } from '../../public-api';

describe('Providers', () => {
  it('should provide with componentProvider', () => {
    const componentProviders = LoadingService.componentProvider(
      ['prop1', 'prop2'],
      { standalone: true }
    );

    TestBed.configureTestingModule({
      providers: [componentProviders],
    });

    const initialState = TestBed.inject(INITIAL_LOADING_STORE);
    expect(initialState).toEqual(['prop1', 'prop2']);

    const options = TestBed.inject(LOADING_STORE_OPTIONS);
    expect(options).toEqual({ standalone: true });

    const parent = TestBed.inject(PARENT_LOADING_STORE);
    expect(parent).toBeNull();
  });

  it('should provide with componentProvider and default behavior', () => {
    const componentProviders = LoadingService.componentProvider([
      'prop1',
      'prop2',
    ]);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LOADING_STORE,
          useValue: new LoadingService([], { standalone: true }, null),
        },
        componentProviders,
      ],
    });

    const parent = TestBed.inject(PARENT_LOADING_STORE);

    expect(parent).toBeInstanceOf(LoadingService);
  });

  it(
    'should provide someLoading',
    marbles(m => {
      const propKey = 'prop1';

      TestBed.configureTestingModule({
        providers: [
          {
            provide: LOADING_STORE,
            useValue: new LoadingService([propKey], { standalone: true }, null),
          },
          provideSomeLoadingState(),
        ],
      });

      const service = TestBed.inject(LOADING_STORE);
      const someLoading$ = TestBed.inject(SOME_LOADING);

      const propKey$ = service.load(
        defer(() => of('test')).pipe(delay(5)),
        propKey
      );

      expect(someLoading$).toBeTruthy();
      expect(someLoading$).toBeInstanceOf(Observable);
      m.expect(propKey$).toBeObservable('-----(a|)', { a: 'test' });
      m.expect(someLoading$).toBeObservable('a----b', { a: true, b: false });
    })
  );
});
