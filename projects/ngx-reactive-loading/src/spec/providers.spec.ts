import { TestBed } from '@angular/core/testing';
import { PropertyTuple } from '../lib/model';
import { LoadingService, LoadingStore } from '../public-api';
import {
  INITIAL_LOADING_STORE,
  LOADING_STORE,
  LOADING_STORE_OPTIONS,
  PARENT_LOADING_STORE,
} from '../lib/internal/tokens';

type RootModuleActions = 'add' | 'delete';
type FeatureModuleActions = 'addFeature' | 'deleteFeature';

describe('Reactive loading module', () => {
  it('should provide with componentProvider', () => {
    const componentProviders = LoadingService.componentProvider(
      ['prop1', 'prop2'],
      { standalone: true }
    );

    TestBed.configureTestingModule({
      providers: [componentProviders],
    });

    const initialState = TestBed.inject(INITIAL_LOADING_STORE);
    expect(initialState).toEqual(['prop1', 'prop2']);

    const options = TestBed.inject(LOADING_STORE_OPTIONS);
    expect(options).toEqual({ standalone: true });

    const parent = TestBed.inject(PARENT_LOADING_STORE);
    expect(parent).toBeNull();
  });

  it('should not be standalone', () => {
    const componentProviders = LoadingService.componentProvider(
      ['prop1', 'prop2'],
      { standalone: false }
    );

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LOADING_STORE,
          useValue: new LoadingService([], { standalone: true }, null),
        },
        componentProviders,
      ],
    });

    const parent = TestBed.inject(PARENT_LOADING_STORE);

    expect(parent).toBeInstanceOf(LoadingService);
  });
});

function assertLoadingStoreState<T extends PropertyKey>(
  expected: string[],
  state: LoadingStore<PropertyTuple<T>>
) {
  const keys = Object.keys(state);
  expect(keys).toEqual(expected);
}
