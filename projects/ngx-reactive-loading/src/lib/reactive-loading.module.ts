import {
  Inject,
  Injector,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { LoadingStoreModuleOptions, PropertyTuple } from './model';
import { LoadingService } from './services';
import {
  FEATURE_LOADING_STORE,
  INITIAL_LOADING_STORE,
  LOADING_STORE,
  LOADING_STORE_OPTIONS,
  ROOT_LOADING_STORE,
  ROOT_LOADING_STORE_GUARD,
} from './internal/tokens';
import {
  provideInitialLoadingState,
  provideLoadingStoreOptions,
  provideParentLoadingStore,
  provideSomeLoadingState,
} from './internal/providers';
import { LoggerService } from './services/logger.service';
import { LoadingDirective } from './components/loading.directive';
import { LoadingStore } from './core';
import { GetLoadingPipe } from './pipes/get-loading.pipe';

/**
 * @internal
 */
@NgModule({})
export class RootReactiveLoadingModule {
  constructor(
    @Optional()
    @Inject(ROOT_LOADING_STORE_GUARD)
    rootLoadingStoreGuard: unknown
  ) {}
}

@NgModule({
  declarations: [LoadingDirective, GetLoadingPipe],
  exports: [LoadingDirective, GetLoadingPipe],
})
export class ReactiveLoadingModule {
  static forRoot<T extends PropertyKey>(
    keys: PropertyTuple<T>,
    options?: LoadingStoreModuleOptions
  ): ModuleWithProviders<ReactiveLoadingModule> {
    const rootStoreDefaultOptions: LoadingStoreModuleOptions = {
      standalone: true,
      logger: false,
    };

    return {
      ngModule: RootReactiveLoadingModule,
      providers: [
        LoggerService,
        {
          provide: ROOT_LOADING_STORE_GUARD,
          useFactory: provideForRootGuard,
          deps: [[ROOT_LOADING_STORE, new Optional(), new SkipSelf()]],
        },
        provideInitialLoadingState(keys),
        provideLoadingStoreOptions(options || rootStoreDefaultOptions),
        {
          provide: LoadingService,
          useFactory: setupLoadingStore,
          deps: [INITIAL_LOADING_STORE, Injector, LOADING_STORE_OPTIONS],
        },
        {
          provide: LOADING_STORE,
          useExisting: LoadingService,
        },
        {
          provide: ROOT_LOADING_STORE,
          useExisting: LoadingService,
        },
        provideSomeLoadingState(),
      ],
    };
  }

  static forFeature<T extends PropertyKey>(
    keys: PropertyTuple<T>,
    options?: LoadingStoreModuleOptions
  ): ModuleWithProviders<ReactiveLoadingModule> {
    const featureStoreDefaultOptions: LoadingStoreModuleOptions = {
      standalone: false,
      logger: false,
    };

    const featureStoreOptions = {
      ...featureStoreDefaultOptions,
      ...(options || {}),
    };

    return {
      ngModule: ReactiveLoadingModule,
      providers: [
        provideLoadingStoreOptions(featureStoreOptions),
        provideParentLoadingStore(),
        provideInitialLoadingState(keys),
        {
          provide: LoadingService,
          useFactory: setupLoadingStore,
          deps: [INITIAL_LOADING_STORE, Injector, LOADING_STORE_OPTIONS],
        },
        {
          provide: LOADING_STORE,
          useExisting: LoadingService,
        },
        {
          provide: FEATURE_LOADING_STORE,
          useExisting: LoadingService,
        },
        provideSomeLoadingState(),
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

function setupLoadingStore<T extends PropertyKey>(
  initialState: PropertyTuple<T>,
  injector: Injector,
  options: LoadingStoreModuleOptions
): LoadingService<T> {
  const service = new LoadingService<any>(initialState, options, null);
  const logger = injector.get(LoggerService);
  if (options.logger) {
    service.events$.subscribe(event => {
      logger.log(
        `LoadingService event: ${options.name || service.constructor.name}`,
        event
      );
    });
  }

  return service as LoadingService<T>;
}
