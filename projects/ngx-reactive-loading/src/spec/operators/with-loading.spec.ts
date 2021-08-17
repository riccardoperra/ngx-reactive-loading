import { BehaviorSubject, of } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { withLoading } from '../../lib/operators';

describe('withLoading', () => {
  it(
    'should update loading',
    marbles(m => {
      const loading$ = new BehaviorSubject<boolean>(false);
      const source$ = m
        .cold('a-b-c|', { a: 1, b: 2, c: 3 })
        .pipe(withLoading(loading$));

      m.expect(source$).toBeObservable('a-b-c|', { a: 1, b: 2, c: 3 });

      m.expect(loading$).toBeObservable('a----b', {
        a: true,
        b: false,
      });
    })
  );
  it(
    'should never end',
    marbles(m => {
      const loading$ = new BehaviorSubject<boolean>(false);
      const source$ = m.hot('a---', { a: 1 }).pipe(withLoading(loading$));

      m.expect(source$).toBeObservable('a---', { a: 1 });

      m.expect(loading$).toBeObservable('a', {
        a: true,
      });
    })
  );
});
