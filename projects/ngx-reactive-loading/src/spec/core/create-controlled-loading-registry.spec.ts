import { createControlledLoadingRegistry } from '../../lib/core/create-loading-registry';
import { ControlledLoadingRegistry } from '../../lib/model';

describe('loadingRegistry', () => {
  let store: ControlledLoadingRegistry;

  beforeEach(() => {
    store = createControlledLoadingRegistry();
  });

  afterEach(() => {
    store.destroy();
    expect(store.keys().length).toBe(0);
  });

  it('should create loading registry with empty value', () => {
    store = createControlledLoadingRegistry();
    expect(store.keys().length).toBe(0);
    expect(store.keys()).toEqual([]);
    expect(store).toBeTruthy();
  });

  it('should create loading registry with default keys', () => {
    store = createControlledLoadingRegistry(['key1' as PropertyKey]);
    expect(store).toBeTruthy();
    expect(store.keys().length).toBe(1);
    expect(store.keys()).toEqual(['key1']);
    expect(store.get('key1')).toBeTruthy();
  });
});
