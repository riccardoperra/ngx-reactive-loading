import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PropertyTuple } from '../lib/model/property';
import { RootReactiveLoadingModule } from '../lib/reactive-loading.module';
import {
  LoadingService,
  LoadingStore,
  ReactiveLoadingModule,
} from '../public-api';

type RootModuleActions = 'add' | 'delete';
type FeatureModuleActions = 'addFeature' | 'deleteFeature';

describe('Reactive loading module', () => {
  it('provide root module and root loading service instance', () => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveLoadingModule.forRoot<RootModuleActions>(['add', 'delete']),
      ],
    });

    const module = TestBed.inject(RootReactiveLoadingModule);
    expect(module).toBeTruthy();

    const loadingStore = TestBed.inject(LoadingService);
    assertLoadingStoreState(['add', 'delete'], loadingStore.state);
  });

  it('create the loading service for feature instance', () => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveLoadingModule.forFeature<FeatureModuleActions>([
          'addFeature',
          'deleteFeature',
        ]),
      ],
    });

    const module = TestBed.inject(ReactiveLoadingModule);
    expect(module).toBeTruthy();

    const loadingStore = TestBed.inject(LoadingService);
    assertLoadingStoreState(
      ['addFeature', 'deleteFeature'],
      loadingStore.state
    );
  });
});

function assertLoadingStoreState<T extends PropertyKey>(
  expected: string[],
  state: LoadingStore<PropertyTuple<T>>
) {
  const keys = Object.keys(state);
  expect(keys).toEqual(expected);
}
