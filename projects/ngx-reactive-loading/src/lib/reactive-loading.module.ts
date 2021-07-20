import {
  Inject,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { PropertyTuple } from './model/property';
import {
  FEATURE_LOADING_STORE,
  ROOT_LOADING_STORE,
  ROOT_LOADING_STORE_GUARD,
} from './providers/token';
import { LoadingStoreOptions } from './model/loading-store-options';
import { LoadingService } from './services';
import {
  provideExistingLoadingStore,
  provideInitialLoadingState,
  provideLoadingStoreOptions,
  provideParentLoadingStore,
} from './providers/provider';
import { LoadingStore } from './model';

@NgModule({})
export class RootReactiveLoadingModule {
  constructor(
    @Optional()
    @Inject(ROOT_LOADING_STORE_GUARD)
    rootLoadingStoreGuard: unknown
  ) {}
}

@NgModule({})
export class ReactiveLoadingModule {
  static forRoot<T extends PropertyKey>(
    keys: PropertyTuple<T>
  ): ModuleWithProviders<ReactiveLoadingModule> {
    const rootStoreDefaultOptions: LoadingStoreOptions = { standalone: true };

    return {
      ngModule: RootReactiveLoadingModule,
      providers: [
        {
          provide: ROOT_LOADING_STORE_GUARD,
          useFactory: provideForRootGuard,
          deps: [[ROOT_LOADING_STORE, new Optional(), new SkipSelf()]],
        },
        provideInitialLoadingState(keys),
        provideLoadingStoreOptions(rootStoreDefaultOptions),
        LoadingService,
        provideExistingLoadingStore(ROOT_LOADING_STORE),
      ],
    };
  }

  static forFeature<T extends PropertyKey>(
    keys: PropertyTuple<T>,
    options?: LoadingStoreOptions
  ): ModuleWithProviders<ReactiveLoadingModule> {
    const featureStoreDefaultOptions: LoadingStoreOptions = {
      standalone: false,
    };

    return {
      ngModule: ReactiveLoadingModule,
      providers: [
        provideInitialLoadingState(keys),
        provideParentLoadingStore,
        provideLoadingStoreOptions(options || featureStoreDefaultOptions),
        LoadingService,
        provideExistingLoadingStore(FEATURE_LOADING_STORE),
      ],
    };
  }
}

function provideForRootGuard(loadingStore: LoadingStore<any> | null) {
  if (loadingStore) {
    throw new TypeError(
      `ReactiveLoadingModule.forRoot() called twice. Feature modules should use ReactiveLoadingModule.forFeature() instead.`
    );
  }
}
