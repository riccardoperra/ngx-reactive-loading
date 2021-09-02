import { ReactiveMap } from '../../lib/internal/reactive-map';
import { Context, marbles } from 'rxjs-marbles';
import { map, ReplaySubject, tap } from 'rxjs';

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

    expect(reactiveMap.keys()).toEqual(['k1', 'k2']);
    expect(reactiveMap.values()).toEqual([1, 2]);
  });

  it('should delete', () => {
    reactiveMap.set('k1', 1);
    reactiveMap.set('k2', 2);
    reactiveMap.set('k3', 3);

    const result = reactiveMap.delete('k1');
    expect(result).toBe(true);

    expect(reactiveMap.keys()).not.toContain('k1');
  });

  it('should clear', () => {
    reactiveMap.set('k1', 1);
    reactiveMap.set('k2', 2);
    reactiveMap.set('k3', 3);

    reactiveMap.clear();
    expect(reactiveMap.keys()).toEqual([]);
    expect(reactiveMap.values()).toEqual([]);
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

      doAction(m, '--a', () => reactiveMap.set('k1', 1));
      doAction(m, '----a', () => reactiveMap.set('k2', 2));
      doAction(m, '------a', () => reactiveMap.set('k3', 3));
      doAction(m, '--------a', () => reactiveMap.delete('k3'));
      doAction(m, '----------a', () => reactiveMap.clear());

      m.equal(
        source$,
        m.hot('a-b-c-d-e-f', {
          a: [],
          b: ['k1'],
          c: ['k1', 'k2'],
          d: ['k1', 'k2', 'k3'],
          e: ['k1', 'k2'],
          f: [],
        })
      );
    })
  );
});

const doAction = (m: Context, expected: string, callback: () => void) => {
  const action = m.cold(expected).pipe(tap(() => callback()));
  m.expect(action).toBeObservable(expected);
};
