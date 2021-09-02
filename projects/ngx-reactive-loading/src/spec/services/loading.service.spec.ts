import { fakeAsync } from '@angular/core/testing';
import { combineLatest, delay, of, timer } from 'rxjs';
import { LoadingService } from '../../public-api';
import { marbles } from 'rxjs-marbles';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService(
      ['prop1', 'prop2'],
      { standalone: true },
      null
    );
  });

  it('should create loading store', () => {
    const expected = ['prop1', 'prop2'];
    expect(Object.keys(service.state)).toEqual(expected);
  });

  it('should throw key cannot be duplicated', () => {
    expect(() => {
      service = new LoadingService(
        ['prop1', 'prop1'],
        { standalone: true },
        null
      );
    }).toThrowError(`Key 'prop1' cannot be duplicated in the current service.`);
  });

  it('should throw key already defined', () => {
    const parent = new LoadingService(
      ['key1', 'key2'],
      { standalone: false },
      null
    );

    expect(() => {
      service = new LoadingService(
        ['prop1', 'key1', 'prop2'],
        { standalone: false },
        parent
      );
    }).toThrowError(`Key 'key1' is already defined by a parent service.`);
  });

  it(
    'isLoading',
    marbles(m => {
      const obs$ = service.load(timer(5), 'prop1');
      m.expect(obs$).toBeObservable('-----(a|)', { a: 0 });

      const isLoading$ = service.isLoading('prop1');
      m.expect(isLoading$).toBeObservable('a----b', { a: true, b: false });
    })
  );

  it(
    'track',
    marbles(m => {
      const obs$ = timer(5).pipe(service.track('prop1'));
      m.expect(obs$).toBeObservable('-----(a|)', { a: 0 });

      const isLoading$ = service.isLoading('prop1');
      m.expect(isLoading$).toBeObservable('a----b', { a: true, b: false });
    })
  );

  it('should throw key not found on track', fakeAsync(() => {
    expect(() => {
      timer(1000).pipe(service.track('notFoundProp')).subscribe();
    }).toThrowError(Error);
  }));

  it(
    'someLoading',
    marbles(m => {
      const prop1$ = service.load(timer(3), 'prop1');
      m.expect(prop1$).toBeObservable('---(a|)', { a: 0 });
      const prop2$ = service.load(timer(6), 'prop2');
      m.expect(prop2$).toBeObservable('------(a|)', { a: 0 });

      const prop1And2$ = combineLatest([prop1$, prop2$]);
      m.expect(prop1And2$).toBeObservable('------(c|)', { c: [0, 0] });

      const someLoading$ = service.someLoading(['prop1', 'prop2']);
      const someLoadingByAll$ = service.someLoading();
      const someLoadingProp1$ = service.someLoading(['prop1']);
      const someLoadingProp2$ = service.someLoading(['prop2']);

      m.expect(someLoading$).toBeObservable('a-----b', { a: true, b: false });
      m.expect(someLoadingByAll$).toBeObservable('a-----b', {
        a: true,
        b: false,
      });
      m.expect(someLoadingProp1$).toBeObservable('a--b', { a: true, b: false });
      m.expect(someLoadingProp2$).toBeObservable('a-----b', {
        a: true,
        b: false,
      });
    })
  );

  it(
    'should throw key not found on someLoading',
    marbles(m => {
      const notFoundProperty = 'property';

      const someLoading$ = service.someLoading([notFoundProperty]);

      m.expect(someLoading$).toBeObservable(
        '#',
        {},
        new Error(`[LoadingService] Property ${notFoundProperty} not found`)
      );
    })
  );

  it(
    'someLoading with parent',
    marbles(m => {
      const parentService = new LoadingService(
        ['parent1'],
        { standalone: true },
        null
      );
      service = new LoadingService(
        ['child1'],
        { standalone: false },
        parentService
      );

      const parent1$ = parentService.load(timer(3), 'parent1');
      m.expect(parent1$).toBeObservable('---(a|)', { a: 0 });
      const child1$ = service.load(timer(6), 'child1');
      m.expect(child1$).toBeObservable('------(a|)', { a: 0 });

      const parent1SomeLoading$ = service.someLoading(['parent1']);
      m.expect(parent1SomeLoading$).toBeObservable('a--b', {
        a: true,
        b: false,
      });
    })
  );

  it(
    'would emit a new value for each property changed',
    marbles(m => {
      const prop1$ = service.load(of('prop1').pipe(delay(10)), 'prop1');
      const prop2$ = service.load(of('prop2').pipe(delay(15)), 'prop2');

      m.expect(service.events$).toBeObservable(
        m.hot('(ab)------c----d', {
          a: { type: 'prop1', loading: true },
          b: { type: 'prop2', loading: true },
          c: { type: 'prop1', loading: false },
          d: { type: 'prop2', loading: false },
        })
      );

      m.expect(prop1$).toBeObservable('----------(a|)', { a: 'prop1' });
      m.expect(prop2$).toBeObservable('---------------(b|)', { b: 'prop2' });
    })
  );

  it('complete when loadingService is destroyed', (doneFn: DoneFn) => {
    const isLoading = service.someLoading([]);

    isLoading.subscribe({
      complete: () => doneFn(),
    });

    service.ngOnDestroy();
  });
});
