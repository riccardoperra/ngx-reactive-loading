import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LoadingStoreModuleOptions, PropertyTuple } from '../lib/model';
import { RootReactiveLoadingModule } from '../lib/reactive-loading.module';
import {
  LoadingService,
  LoadingStore,
  ReactiveLoadingModule,
} from '../public-api';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { defer, of, delay } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { LoggerService } from '../lib/services/logger.service';
import {
  INITIAL_LOADING_STORE,
  LOADING_STORE_OPTIONS,
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
          { standalone: true, name: 'testFeature' }
        ),
      ],
    });

    const module = TestBed.inject(ReactiveLoadingModule);

    expect(module).toBeInstanceOf(ReactiveLoadingModule);
    expect(TestBed.inject(INITIAL_LOADING_STORE)).toEqual([
      'addFeature',
      'deleteFeature',
    ]);
    expect(TestBed.inject(LOADING_STORE_OPTIONS)).toEqual({
      standalone: true,
      logger: false,
      name: 'testFeature',
    } as LoadingStoreModuleOptions);

    const loadingStore = TestBed.inject(LoadingService);

    assertLoadingStoreState(
      ['addFeature', 'deleteFeature'],
      loadingStore.state
    );
  });

  it('should create feature service with default options', () => {
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

    const options = TestBed.inject<LoadingStoreModuleOptions>(
      LOADING_STORE_OPTIONS
    );

    expect(options).toEqual({
      standalone: false,
      logger: false,
    });
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
    }).subscribe({ error: err => expect(err).toBeInstanceOf(Error) });
  });

  it(
    'should log events with LoadingService name',
    marbles(m => {
      TestBed.configureTestingModule({
        imports: [
          ReactiveLoadingModule.forRoot(['prop1'], {
            logger: true,
          }),
        ],
        providers: [],
      });

      const service = TestBed.inject(LoadingService);
      const logger = TestBed.inject(LoggerService);
      const prop1$ = service.load(of(null).pipe(delay(5)), 'prop1');
      const loggerLog = spyOn(logger, 'log').and.callThrough();

      m.expect(prop1$).toBeObservable('-----(a|)', { a: null });
      m.flush();

      expect(loggerLog).toHaveBeenCalledTimes(2);

      expect(loggerLog).toHaveBeenCalledWith(
        `LoadingService event: ${service.constructor.name}`,
        { type: 'prop1', loading: true }
      );

      expect(loggerLog).toHaveBeenCalledWith(
        `LoadingService event: ${service.constructor.name}`,
        { type: 'prop1', loading: false }
      );
    })
  );
  it(
    'should log events with named module',
    marbles(m => {
      const moduleName = 'TestModule';

      TestBed.configureTestingModule({
        imports: [
          ReactiveLoadingModule.forRoot(['prop1'], {
            logger: true,
            name: moduleName,
          }),
        ],
        providers: [],
      });

      const service = TestBed.inject(LoadingService);
      const logger = TestBed.inject(LoggerService);
      const prop1$ = service.load(of(null).pipe(delay(5)), 'prop1');
      const loggerLog = spyOn(logger, 'log').and.callThrough();
      m.expect(prop1$).toBeObservable('-----(a|)', { a: null });

      m.flush();

      expect(loggerLog).toHaveBeenCalledTimes(2);

      expect(loggerLog).toHaveBeenCalledWith(
        `LoadingService event: ${moduleName}`,
        { type: 'prop1', loading: true }
      );

      expect(loggerLog).toHaveBeenCalledWith(
        `LoadingService event: ${moduleName}`,
        { type: 'prop1', loading: false }
      );
    })
  );
});

function assertLoadingStoreState<T extends PropertyKey>(
  expected: string[],
  state: LoadingStore<PropertyTuple<T>>
) {
  const keys = Object.keys(state);
  expect(keys).toEqual(expected);
}
