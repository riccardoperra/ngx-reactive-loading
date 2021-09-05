import { noop, of, pipe } from 'rxjs';
import {
  isLoadingStoreState,
  LOADING_STORE_STATE_SYMBOL,
  LoadingStoreState,
} from '../../lib/internal/factory';
import {
  isLoadingStore,
  LoadingStore,
} from '../../lib/core/create-loading-store';

describe('loading store type guards', () => {
  it('is loadingStoreState', () => {
    const obj: LoadingStoreState = {
      type: LOADING_STORE_STATE_SYMBOL,
      $: of(true),
      track: pipe,
      destroy: noop,
    };

    const result = isLoadingStoreState(obj);

    expect(result).toBeTrue();
  });

  it('should not be loadingStoreState', () => {
    let result: boolean;

    result = isLoadingStoreState({
      type: 'loadingStoreState',
      $: 'true',
      track: {},
      destroy: noop,
    });
    expect(result).toBeFalse();

    result = isLoadingStoreState({
      $: of(true),
      track: {},
      destroy: noop,
    } as Partial<LoadingStoreState>);
    expect(result).toBeFalse();

    result = isLoadingStoreState(null);
    expect(result).toBeFalse();
  });

  it('should be loadingStore', () => {
    const obj: LoadingStore<['prop1', 'prop2']> = {
      prop1: {
        type: LOADING_STORE_STATE_SYMBOL,
        $: of(true),
        track: pipe,
        destroy: noop,
      },
      prop2: {
        type: LOADING_STORE_STATE_SYMBOL,
        $: of(false),
        track: pipe,
        destroy: noop,
      },
    };

    const result = isLoadingStore(obj);

    expect(result).toBeTrue();
  });

  it('is not loading store', () => {
    const obj = {
      prop1: {
        $: of(true),
        track: pipe,
      },
      prop2: {
        $: false,
        track: pipe,
      },
    };

    const result = isLoadingStore(obj);

    expect(result).toBeFalse();
  });
});
