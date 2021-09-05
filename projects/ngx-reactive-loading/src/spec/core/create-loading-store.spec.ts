import { Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { tap } from 'rxjs/operators';
import { createLoadingStore } from '../../lib/core';

describe('createLoadingStore', () => {
  it('should create store', () => {
    const keys = ['key1'];
    const store = createLoadingStore(keys);

    expect(store).toBeTruthy();
    expect(Object.keys(store).length).toBe(1);
    expect(Object.keys(store)).toEqual(keys);

    expect(store.key1.$).toBeInstanceOf(Observable);
    expect(store.key1.track).toBeInstanceOf(Function);
  });

  it(
    'should destroy',
    marbles(m => {
      const store = createLoadingStore<['key1']>(['key1']);

      const loading$ = store.key1.$;

      const source = m
        .cold('-----a|', { a: 1 })
        .pipe(tap(() => store.key1.destroy()));
      m.expect(source).toBeObservable('-----a|', { a: 1 });

      m.expect(loading$).toBeObservable('a----|', { a: false });
    })
  );
});
