![NGX Reactive Loading](./reactive_loading_banner.png)

> Better loading state in Angular applications with RxJS

[![npm version](https://badge.fury.io/js/ngx-reactive-loading.svg)](https://www.npmjs.com/package/ngx-reactive-loading)
[![bundle size](https://img.shields.io/bundlephobia/min/ngx-reactive-loading)](https://www.npmjs.com/package/ngx-reactive-loading)
[![npm downloads](https://img.shields.io/npm/dw/ngx-reactive-loading)](https://www.npmjs.com/package/ngx-reactive-loading)
[![license](https://img.shields.io/npm/l/ngx-reactive-loading)](https://github.com/riccardoperra/ngx-reactive-loading/blob/main/LICENSE)
[![Coverage Status](https://coveralls.io/repos/github/riccardoperra/ngx-reactive-loading/badge.svg?branch=main)](https://coveralls.io/github/riccardoperra/ngx-reactive-loading?branch=main)
[![Supported version](https://img.shields.io/badge/Support%20Angular-12%2B-%23D6002F)](https://github.com/riccardoperra/ngx-reactive-loading)

## Table of contents

- [Table of contents](#table-of-contents)
- [Getting started](#getting-started)
- [Basic usage](#basic-usage)
- [Loading service](#working-with-loading-service)
  - [Api](#loading-service-api)
  - [Use with components](#use-with-components)
  - [Use with modules](#use-with-modules)
    - [Registering root loading service](#registering-root-loading-service)
    - [Registering feature loading service](#registering-feature-loading-service)
    - [Custom module configuration](#custom-module-configuration)
- [Loading directive](#using-loading-directive)
- [Tokens](#tokens)
- [Utils](#utils)
- [Demo](projects/ngx-reactive-loading-demo)

## Getting started

Install with npm

```
npm i ngx-reactive-loading
```

Or with yarn

```
yarn add ngx-reactive-loading
```

## Basic usage

The loading store is the core of this library, it allows handling different loading states through your application.

To create a loading store that will track all your loading states, you must call the `createLoadingStore` function
specifying the properties that will be tracked.

```ts
type LoadingStoreState = {
  /**
   * Subscribe to loading changes
   */
  readonly $: Observable<boolean>;
  /**
   * Update the loading observable
   */
  readonly track: <T>() => MonoTypeOperatorFunction<T>;
};
```

```ts
import { createLoadingStore } from 'ngx-reactive-loading';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

enum ExampleComponentActions {
  Add = 'add',
  Reload = 'reload',
}

@Component({
  selector: 'app-example',
  template: ``,
})
export class ExampleComponent implements OnInit {
  readonly loadingStore = createLoadingStore([
    ExampleComponentActions.Add,
    ExampleComponentActions.Reload,
  ]);

  readonly isAdding$: Observable<boolean> =
    this.loadingStore[ExampleComponentActions.Add].$;
  readonly isReloading$: Observable<boolean> =
    this.loadingStore[ExampleComponentActions.Reload].$;
  readonly isLoading$: Observable<boolean> = someLoading([this.loadingStore]);

  constructor(private readonly http: HttpClient) {}

  add() {
    this.http
      .post('/')
      .pipe(this.loadingStore[ExampleComponentActions.Add].track())
      .subscribe();
  }

  reload() {
    this.http
      .get('/')
      .pipe(this.loadingStore[ExampleComponentActions.Reload].track())
      .subscribe();
  }
}
```

## Working with Loading Service

If you need a more sophisticated way to handle loading states, for a better integration with Angular dependency
injection, you can provide the loading service that will expose the loading store api's.

### Loading service api

The LoadingService API includes convenient methods for handling loading state.

```ts
export type PropertyTuple<T extends PropertyKey> = readonly [...T[]];

export interface LoadingStoreOptions {
  /**
   * Isolate the service instance, removing all references to loading service parent.
   */
  standalone: boolean;
}

export interface LoadingService<T extends PropertyKey> {
  /**
   * The loading store state.
   */
  readonly state: LoadingStore<PropertyTuple<T>>;
  /**
   * Observe loading state property changes.
   */
  readonly events$: Observable<LoadingEvent>;

  /**
   * Provide a LoadingService into the component with the property keys and the given options.   *
   * Options default value is {standalone: false}.
   */
  componentProvider<T extends PropertyKey>(
    keys: PropertyTuple<T>,
    options?: LoadingStoreOptions
  ): LoadingService;

  /**
   * Returns the given observable with the loading operator attached.
   * This allows to update the loading state of the given property
   * automatically after each value emission.
   *
   * @example
   * import {LoadingService} from 'ngx-reactive-loading';
   *
   * type ExampleActions = 'add' | 'delete';
   *
   * @Component({
   *   template: ``,
   *   providers: [
   *     LoadingService.componentProvide<ExampleActions>(['add', 'delete'])
   *   ]
   * })
   * export class ExampleComponent {
   *   constructor(private readonly loadingService: LoadingService<ExampleActions>,
   *               private readonly http: HttpClient) {
   *     this.loadingService
   *      .load(this.http.post('/', {}), 'add')
   *      .subscribe();
   *   }
   * }
   *
   */
  load<S>(source$: Observable<S>, property: T): Observable<S>;

  /**
   * Wrapper of state.key.track() pipe. This operator will update
   * automatically the loading state property by the given key.
   *
   * @example
   * import {LoadingService} from 'ngx-reactive-loading';
   *
   * type ExampleActions = 'add' | 'delete';
   *
   * @Component({
   *   template: ``,
   *   providers: [
   *     LoadingService.componentProvide<ExampleActions>(['add', 'delete'])
   *   ]
   * })
   * export class ExampleComponent {
   *   constructor(private readonly loadingService: LoadingService<ExampleActions>,
   *               private readonly http: HttpClient) {
   *     this.http.post('/', {})
   *      .pipe(this.loadingService.track('add'))
   *      .subscribe();
   *   }
   * }
   *
   */
  track<O>(key: T): MonoTypeOperatorFunction<O>;

  /**
   * Track the changes of the given loading state property.
   * The returned observable has built-in memoization with
   * default rxjs distinctUntilChanged operator and it has
   * subscription optimization with shareReplay
   *
   * @example
   * import {LoadingService} from 'ngx-reactive-loading';
   *
   * type ExampleActions = 'add' | 'delete';
   *
   * @Component({
   *   template: ``,
   *   providers: [
   *     LoadingService.componentProvide<ExampleActions>(['add', 'delete'])
   *   ]
   * })
   * export class ExampleComponent {
   *   readonly isAdding$: Observable<boolean> = this.loadingService.isLoading('add');
   *
   *   constructor(private readonly loadingService: LoadingService<ExampleActions>)
   * }
   *
   */
  isLoading(property: T): Observable<boolean>;

  /**
   * Subscribe to the changes the loading state by the given property.
   * Default behavior checks for all properties.
   *
   * @example
   * import {LoadingService} from 'ngx-reactive-loading';
   *
   * type ExampleActions = 'add' | 'delete';
   *
   * @Component({
   *   template: ``,
   *   providers: [
   *     LoadingService.componentProvide<ExampleActions>(['add', 'delete'])
   *   ]
   * })
   * export class ExampleComponent {
   *   readonly isAddingOrDeleting$: Observable<boolean> = this.loadingService.someLoading([
   *    'add',
   *    'delete'
   *   ]);
   *
   *   constructor(private readonly loadingService: LoadingService<ExampleActions>)
   * }
   *
   */
  someLoading(properties: PropertyTuple<T> = []): Observable<boolean>;

  /**
   * Unsubscribe all subscription on component destroy.
   */
  ngOnDestroy(): void;
}
```

### Use with components

To use the loading service with angular components and dependency injection you must provide the service into the
component provider with the `LoadingService.componentProvider` method. The loading service is subscribed to throughout
the lifecycle of the component, and it will manage all your loading subscriptions.

```ts
import { LoadingService } from 'ngx-reactive-loading';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

type ComponentAction = 'add' | 'reload';

@Component({
  selector: 'app-example',
  template: ``,
  providers: [
    LoadingService.componentProvider<ComponentAction>(['add', 'reload']),
  ],
})
export class ExampleComponent implements OnInit {
  readonly loadingStoreState = this.loadingStore.state;
  readonly isAdding$: Observableb<boolean> = this.loadingStoreState.add.$;
  readonly isReloading$: Observable<boolean> = this.loadingStoreState.add.$;

  constructor(
    private readonly http: HttpClient,
    private readonly loadingStore: LoadingService<ComponentAction>
  ) {}

  add() {
    // Using load helper
    this.loadingStore.load(() => this.http.post('/', {}), 'add').subscribe();
  }

  reload() {
    // Using track helper
    this.http.get('/').pipe(this.loadingStore.track('reload')).subscribe();
  }
}
```

### Use with modules

There are some scenarios when you may need to provide the loading service at the root or in a feature module, for
example when using a global state manager like NGRX. You can do it calling the `ReactiveLoadingModule.forRoot`
or `ReactiveLoadingModule.forChild` methods.

#### Registering root loading service

To register a loading service at the root of your application, you must add the `ReactiveLoadingModule.forRoot()` method
with the array of the properties that will be tracked.

```ts
import { ReactiveLoadingModule } from 'ngx-reactive-loading';

type RootLoadingActions = 'globalReload';

@NgModule({
  imports: [
    ReactiveLoadingModule.forRoot<RootLoadingActions>(['globalReload']),
  ],
})
export class AppModule {}
```

#### Registering feature loading service

For feature modules you must register your loading service by adding the `ReactiveLoadingModule.forChild()` method in
the imports of your `NgModule` with the service options.

```ts
import { ReactiveLoadingModule } from 'ngx-reactive-loading';

type TodoLoadingActions = 'addTodo' | 'removeTodo' | 'reloadTodo';

@NgModule({
  imports: [
    ReactiveLoadingModule.forFeature(
      ['addTodo', 'removeTodo', 'reloadTodo'],
      { standalone: false } // This is the default behavior
    ),
  ],
})
export class TodoModule {}
```

#### Custom module configuration

Using the `ReactiveLoadingModule` allows you to provide extra configuration params in addition to loading store options.

```ts
export interface LoadingStoreModuleOptions extends LoadingStoreOptions {
  /**
   * When true, log all loading state changes to the console.
   * Use for debugging.
   */
  logger?: boolean;
  /**
   * The name of the provider. Useful for named logs.
   */
  name?: string;
}
```

##### Event logger

With the event logger, there will be a default eventListener to the loading store that will log all loading property
changes automatically in the console. Providing the `name` option, the log will include also that name to differentiate
it.

```ts
// feature.module.ts
@NgModule({
  imports: [
    ReactiveLoadingModule.forFeature(['addTodo', 'removeTodo', 'reloadTodo'], {
      standalone: false,
      name: 'FeatureModule1',
      logger: true,
    }),
  ],
})
export class FeatureModule {}
```

### Tokens

#### SOME_LOADING

The `SOME_LOADING` token is automatically provided when providing the loading service in a component or in modules. When
injected, it allows you to observe the changes to the state between all service loading property, like the `someLoading`
helper function.

```ts
import { ReactiveLoadingModule, LoadingService } from 'ngx-reactive-loading';
import { Inject, Component, NgModule } from '@angular/core';
import { of, Observable } from 'rxjs';

@Component({ template: `<app-hello></app-hello>` })
export class AppComponent {
  constructor(private readonly loadingService: LoadingService) {
    of(1).pipe(loadingService.track('prop1')).subscribe();
  }
}

@Component({ template: ``, selector: 'app-hello' })
export class HelloComponent {
  constructor(
    @Inject(SOME_LOADING) private readonly someLoading$: Observable<boolean>
  ) {}
}

@NgModule({
  declarations: [AppComponent, HelloComponent],
  imports: [ReactiveLoadingModule.forRoot(['prop1'])],
})
export class AppModule {}
```

### Utils

- someLoading

  ```ts
  import { createLoadingStore, someLoading } from 'ngx-reactive-loading';

  const loadingStore = createLoadingStore(['add' | 'remove']);

  /**
   * Giving the loading store
   */
  const isLoadingAll$ = someLoading([loadingStore]);
  /**
   * Giving the loading store property
   */
  const isAdding$ = someLoading([loadingStore.add]);
  /**
   * Giving the loading store property observable
   */
  const isRemoving$ = someLoading([loadingStore.remove.$]);
  /**
   * Giving multiple property
   */
  const isAddingOrRemoving$ = someLoading([
    loadingStore.remove,
    loadingStore.add.$,
  ]);
  ```

- withLoading - Update the subject at the first emission and on complete

  ```ts
  import { withLoading } from 'ngx-reactive-loading';
  import { of, Subject } from 'rxjs';

  const isLoading$ = new Subject<boolean>();
  const $ = of(1).pipe(delay(1000), withLoading(isLoading$));

  isLoading$.subscribe(result => {
    // Output 1: true
    // Output 2: false (after 1000ms)
  });

  $.subscribe(result => {
    // Output 1: 1
  });
  ```

- toLoadingEvent - Map loading store change to LoadingEvent object

  ```ts
  import {
    createLoadingStore,
    withLoading,
    toLoadingEvent,
  } from 'ngx-reactive-loading';
  import { of, Subject } from 'rxjs';

  const store = createLoadingStore(['key1']);
  const $ = of(1).pipe(delay(1000), store.key1.track());

  const events$ = toLoadingEvent(store);

  $.subscribe(result => {
    // Output 1: 1
  });

  events$.subscribe(result => {
    // Output 1: {type: 'key1', loading: true}
    // Output 2 (after 1000ms): {type: 'key1', loading: false}
  });
  ```

## Using loading directive

Loading directive provide a simple approach to switch templates when the loading state change. 
To work correctly the loading service must be provided by a component or module.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingService } from 'ngx-reactive-loading';

@Component({
  selector: 'app-root',
  template: `
    <button *loading="'add'; else loadingTpl">Add</button>
    <ng-template #loadingTpl>Loading...</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoadingService.componentProvide(['add'])],
})
class AppComponent {
  constructor(private readonly loadingService: LoadingService) {}
}
```

### API

#### Inputs

| Input            | Type                         | Default | Required | Description                                             |
| ---------------- | ---------------------------- | ------- | -------- | ------------------------------------------------------- |
| [ngxLoading]     | PropertyKey \| PropertyKey[] | []      | false    | Set the loading state properties that will be observed  |
| [ngxLoadingElse] | TemplateRef<unknown> \| null | null    | false    | Render the custom loading template when `loading` is true |
