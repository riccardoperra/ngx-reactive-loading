import { Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { createLoadingRegistry, createLoadingStore } from '../../lib/core';
import { GetLoadingPipe } from '../../lib/pipes/get-loading.pipe';

describe('getLoadingPipe', () => {
  const getLoadingPipe = new GetLoadingPipe();

  it(
    'should return observable from loading store key',
    marbles(m => {
      const store = createLoadingStore(['key1', 'key2']);
      const loading$ = getLoadingPipe.transform(store, 'key1');

      const source = m
        .cold('----a|', { a: 'complete' })
        .pipe(store.key1.track());

      m.expect(source).toBeObservable('----a|', { a: 'complete' });
      expect(loading$).toBeInstanceOf(Observable);
      m.expect(loading$).toBeObservable('a----b', { a: true, b: false });
    })
  );

  it(
    'should return observable from loading store array of key',
    marbles(m => {
      const store = createLoadingStore(['key1', 'key2']);
      const loading$ = getLoadingPipe.transform(store, ['key1', 'key2']);

      const source = m
        .cold('----a|', { a: 'complete' })
        .pipe(store.key1.track(), store.key2.track());

      m.expect(source).toBeObservable('----a|', { a: 'complete' });
      expect(loading$).toBeInstanceOf(Observable);
      m.expect(loading$).toBeObservable('a----b', { a: true, b: false });
    })
  );

  it(
    'should return observable from loading registry keys',
    marbles(m => {
      const store = createLoadingRegistry();
      const loading$ = getLoadingPipe.transform(store, ['key1', 'key12']);
      store.addAll(['key1']);

      const source = m
        .cold('----a|', { a: 'complete' })
        .pipe(store.track('key1'));

      m.expect(source).toBeObservable('----a|', { a: 'complete' });
      expect(loading$).toBeInstanceOf(Observable);
      m.expect(loading$).toBeObservable('a----b', { a: true, b: false });
    })
  );
});
