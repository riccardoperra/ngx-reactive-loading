import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PropertyTuple } from '../lib/model';
import { RootReactiveLoadingModule } from '../lib/reactive-loading.module';
import {
  LoadingService,
  LoadingStore,
  ReactiveLoadingModule,
} from '../public-api';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { defer } from 'rxjs';
import {
  INITIAL_LOADING_STORE,
  LOADING_STORE,
  LOADING_STORE_OPTIONS,
  PARENT_LOADING_STORE,
} from '../lib/internal/tokens';

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

  it('should create standalone feature service', () => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveLoadingModule.forFeature<FeatureModuleActions>(
          ['addFeature', 'deleteFeature'],
          { standalone: true }
        ),
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

  it('should throw twice .forRoot error', () => {
    @NgModule({
      imports: [ReactiveLoadingModule.forRoot([])],
    })
    class FeatureModule {}

    TestBed.configureTestingModule({
      imports: [
        ReactiveLoadingModule.forRoot([]),
        RouterTestingModule.withRoutes([
          {
            path: 'featureModule',
            loadChildren: () => Promise.resolve(FeatureModule),
          },
        ]),
      ],
    });

    const router = TestBed.inject(Router);

    defer(() => {
      return router.navigate(['featureModule']);
    }).subscribe({
      error: err => expect(err).toBeInstanceOf(TypeError),
    });
  });
});

function assertLoadingStoreState<T extends PropertyKey>(
  expected: string[],
  state: LoadingStore<PropertyTuple<T>>
) {
  const keys = Object.keys(state);
  expect(keys).toEqual(expected);
}
