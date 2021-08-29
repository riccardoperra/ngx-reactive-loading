import { BehaviorSubject, Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { withLoading } from '../../lib/operators';
import { someLoading } from '../../lib/utils';
import { createLoadingStore } from '../../lib/core';

describe('someLoading', () => {
  it(
    'should return if there is loading',
    marbles(m => {
      const firstLoading$ = new BehaviorSubject<boolean>(false);
      const first$: Observable<string> = m
        .cold('---(a|)', { a: 'first' })
        .pipe(withLoading(firstLoading$));

      m.expect(first$).toBeObservable('---(a|)', { a: 'first' });

      const secondLoading$ = new BehaviorSubject<boolean>(false);
      const second$: Observable<string> = m
        .cold('-----(a|)', { a: 'second' })
        .pipe(withLoading(secondLoading$));

      m.expect(second$).toBeObservable('-----(a|)', { a: 'second' });

      const someLoading$ = someLoading([firstLoading$, secondLoading$]);

      m.expect(someLoading$).toBeObservable('a----b', { a: true, b: false });
    })
  );

  it(
    'should return if there is loading with loading store states',
    marbles(m => {
      const loadingStore = createLoadingStore<['add', 'delete']>([
        'add',
        'delete',
      ]);

      const first$: Observable<number> = m
        .cold('---(a|)', { a: 0 })
        .pipe(loadingStore.add.track());

      m.expect(first$).toBeObservable('---(a|)', { a: 0 });

      const second$: Observable<number> = m
        .cold('----(a|)', { a: 1 })
        .pipe(loadingStore.delete.track());

      m.expect(second$).toBeObservable('----(a|)', { a: 1 });

      const someLoadingStore$ = someLoading([loadingStore]);
      const someLoadingAdd$ = someLoading([loadingStore.add]);
      const someLoadingDelete$ = someLoading([loadingStore.delete.$]);
      const someLoading$ = someLoading([
        loadingStore.add,
        loadingStore.delete.$,
      ]);

      m.expect(someLoading$).toBeObservable('a---b', { a: true, b: false });

      m.expect(someLoadingStore$).toBeObservable('a---b', {
        a: true,
        b: false,
      });

      m.expect(someLoadingAdd$).toBeObservable('a--b', { a: true, b: false });
      m.expect(someLoadingDelete$).toBeObservable('a---b', {
        a: true,
        b: false,
      });
    })
  );

  it(
    'should no update if is invalid loading',
    marbles(m => {
      const value: any = 0;

      const loading$ = someLoading([value]);
      m.expect(loading$).toBeObservable('|');
    })
  );
});
