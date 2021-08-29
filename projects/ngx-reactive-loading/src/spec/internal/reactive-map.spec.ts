import { ReactiveMap } from '../../lib/internal/reactive-map';
import { marbles } from 'rxjs-marbles';
import { Observable, of, ReplaySubject } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

describe('reactiveMap', () => {
  let reactiveMap = new ReactiveMap<PropertyKey, unknown>();

  beforeEach(() => {
    reactiveMap = new ReactiveMap<PropertyKey, unknown>();
  });

  it('should return many', () => {
    reactiveMap.set('k1', 1);
    reactiveMap.set('k2', 2);
    reactiveMap.set('k3', 3);

    const expected = [1, 2, 3];
    const result = reactiveMap.getMany(['k1', 'k2', 'k3']);
    expect(result).toEqual(expected);
  });

  it('should set many', () => {
    reactiveMap.setMany([
      ['k1', 1],
      ['k2', 2],
      ['k2', 3],
    ]);

    expect(Array.from(reactiveMap.keys())).toEqual(['k1', 'k2']);
    expect(Array.from(reactiveMap.values())).toEqual([1, 2]);
  });

  it('should delete', () => {
    reactiveMap.set('k1', 1);
    reactiveMap.set('k2', 2);
    reactiveMap.set('k3', 3);

    const result = reactiveMap.delete('k1');
    expect(result).toBe(true);
  });

  it('should not delete', () => {
    const result = reactiveMap.delete('no_exist');
    expect(result).toBe(false);
  });

  it(
    'should observe changes',
    marbles(m => {
      const replaySubject$ = new ReplaySubject<
        ReactiveMap<PropertyKey, unknown>
      >(1);
      reactiveMap.changes$.subscribe(replaySubject$);
      const source$ = replaySubject$.pipe(map(_ => Array.from(_.keys())));

      const s1 = m
        .cold('--a', { a: 1 })
        .pipe(tap(() => reactiveMap.set('k1', 1)));
      m.expect(s1).toBeObservable('--a', { a: 1 });
      const s2 = m
        .cold('----a', { a: 1 })
        .pipe(tap(() => reactiveMap.set('k2', 2)));
      m.expect(s2).toBeObservable('----a', { a: 1 });
      const s3 = m
        .cold('------a', { a: 1 })
        .pipe(tap(() => reactiveMap.set('k3', 3)));
      m.expect(s3).toBeObservable('------a', { a: 1 });

      m.equal(
        source$,
        m.hot('a-b-c-d', {
          a: [],
          b: ['k1'],
          c: ['k1', 'k2'],
          d: ['k1', 'k2', 'k3'],
        })
      );
    })
  );
});

function delayedAction(callback: () => void, delayN: number): Observable<void> {
  return of(void 0).pipe(delay(delayN), tap(callback));
}
