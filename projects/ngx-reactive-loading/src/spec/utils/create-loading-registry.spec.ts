import { Observable, ReplaySubject } from 'rxjs';
import { createLoadingRegistry } from '../../lib/core';
import { LoadingRegistry } from '../../lib/model/loading-registry';
import { marbles } from 'rxjs-marbles';

describe('loadingRegistry', () => {
  let store: LoadingRegistry<any>;

  beforeEach(() => {
    store = createLoadingRegistry<'key0' | 'key1'>(['key0']);
  });

  it('should create loading registry with empty value', () => {
    store = createLoadingRegistry();
    expect(store).toBeTruthy();
  });

  it('get', () => {
    let key1 = store.get('key1');
    expect(key1).toBeNull();

    store.add('key1');
    key1 = store.get('key1');
    expect(key1).toBeTruthy();
    expect(key1?.$).toBeInstanceOf(Observable);
    expect(key1?.track).toBeInstanceOf(Function);
  });

  it(
    'delete',
    marbles(m => {
      let key0 = store.get('key0');
      expect(key0).toBeTruthy();

      store.delete('key0');
      key0 = store.get('key0');

      expect(key0).toBeNull();
    })
  );

  it(
    'registry',
    marbles(m => {
      const replaySubject$ = new ReplaySubject();
      store.registry$.subscribe(replaySubject$);
      store.add('k1');
      store.add('k2');
      store.delete('key0');

      m.equal(
        replaySubject$,
        m.hot('(abcd)', {
          a: { key0: false },
          b: { key0: false, k1: false },
          c: { key0: false, k1: false, k2: false },
          d: { k1: false, k2: false },
        })
      );
    })
  );

  it(
    'someLoading',
    marbles(m => {
      store.add('k1');
      const loading$ = store.someLoading(['k1']);
      const source = m.cold('---a|', { a: 1 }).pipe(store.track('k1'));
      m.expect(source).toBeObservable('---a|', { a: 1 });
      m.expect(loading$).toBeObservable(m.cold('a---b', { a: true, b: false }));
    })
  );

  it(
    'isLoading',
    marbles(m => {
      const loading$ = store.isLoading('key0');
      const source = m.cold('---a|', { a: 1 }).pipe(store.track('key0'));
      m.expect(source).toBeObservable('---a|', { a: 1 });
      m.expect(loading$).toBeObservable(m.cold('a---b', { a: true, b: false }));
    })
  );

  it(
    'isLoading with undefined key',
    marbles(m => {
      const loading$ = store.isLoading('no_exist');
      const source = m.cold('---a|', { a: 1 }).pipe(store.track('no_exist'));
      m.expect(source).toBeObservable('---a|', { a: 1 });
      m.expect(loading$).toBeObservable(m.cold('a', { a: false }));
    })
  );

  it(
    'track',
    marbles(m => {
      const loading$ = store.isLoading('key0');
      const source = m
        .cold('---a|', { a: 1 })
        .pipe(store.track('source'), store.track('key0'));
      m.expect(source).toBeObservable('---a|', { a: 1 });
      m.expect(loading$).toBeObservable(m.cold('a---b', { a: true, b: false }));
    })
  );

  it(
    'add',
    marbles(m => {
      store = createLoadingRegistry();
      const replaySubject$ = new ReplaySubject();
      store.registry$.subscribe(replaySubject$);

      expect(store.get('k1')).toBeNull();
      store.add('k1');
      expect(store.get('k1')).toBeTruthy();

      expect(store.get('k2')).toBeNull();
      store.add('k2');
      expect(store.get('k2')).toBeTruthy();

      m.equal(
        replaySubject$,
        m.hot('(abc)', {
          a: {},
          b: { k1: false },
          c: { k1: false, k2: false },
        })
      );
    })
  );

  it(
    'addAll',
    marbles(m => {
      store = createLoadingRegistry();
      const replaySubject$ = new ReplaySubject();
      store.registry$.subscribe(replaySubject$);

      expect(store.get('k1')).toBeNull();
      expect(store.get('k2')).toBeNull();
      store.addAll(['k1', 'k2']);

      expect(store.get('k1')).toBeTruthy();
      expect(store.get('k2')).toBeTruthy();

      m.equal(
        replaySubject$,
        m.hot('(ab)', {
          a: {},
          b: { k1: false, k2: false },
        })
      );
    })
  );

  it('destroy', () => {
    store.add('k1');
    store.add('k2');
    expect(store.keys()).toEqual(['key0', 'k1', 'k2']);

    store.destroy();

    expect(store.keys()).toEqual([]);
  });

  it(
    'should remove and close subscriptions',
    marbles(m => {
      const loading$ = store.isLoading('key0');
      const source = m.cold('---a|', { a: 1 }).pipe(store.track('key0'));
      m.expect(source).toBeObservable('---a|', { a: 1 });
      m.expect(loading$).toBeObservable(m.cold('a---b', { a: true, b: false }));
    })
  );
});
