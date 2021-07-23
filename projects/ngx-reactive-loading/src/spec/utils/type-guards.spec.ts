import { of, pipe } from 'rxjs';
import {
  isLoadingStore,
  isLoadingStoreState,
  LoadingStore,
  LoadingStoreState,
} from '../../lib/model';

describe('loading store type guards', () => {
  it('is loadingStoreState', () => {
    const obj: LoadingStoreState = {
      $: of(true),
      track: pipe,
    };

    const result = isLoadingStoreState(obj);

    expect(result).toBeTrue();
  });

  it('is not loadingStoreState', () => {
    const obj: any = {
      $: 'true',
      track: {},
    };

    const result = isLoadingStoreState(obj);

    expect(result).toBeFalse();
  });

  it('is loadingStore', () => {
    const obj: LoadingStore<['prop1', 'prop2']> = {
      prop1: {
        $: of(true),
        track: pipe,
      },
      prop2: {
        $: of(false),
        track: pipe,
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
