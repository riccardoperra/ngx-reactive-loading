import { Observable } from 'rxjs';
import { createLoadingStore } from '../../lib/utils';

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
});
