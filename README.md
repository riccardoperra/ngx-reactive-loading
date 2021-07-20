> Better loading state in Angular applications with RxJS

[![npm version](https://badge.fury.io/js/ngx-reactive-loading.svg)](https://www.npmjs.com/package/ngx-reactive-loading)
[![bundle size](https://img.shields.io/bundlephobia/min/ngx-reactive-loading)](https://www.npmjs.com/package/ngx-reactive-loading)

## Table of contents

- [Table of contents](#table-of-contents)
- [Getting started](#getting-started)
- [Basic usage](#basic-usage)
- [Working with loading service](#working-with-loading-service)
  - [Loading service api](#loading-service-api)
  - [Providing in components](#component-based-loading-service)
  - [Providing in modules](#module-based-loading-service)
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

The loading store is the core of this library, it allows handling different loading states through your
application.

To create a loading store that will track all your loading states, you must call the `createLoadingStore` function
specifying the properties that will be tracked.

```ts
type LoadingStoreState = {
  /**
   * The observable that will be updated automatically (loading: true | false)
   */
  readonly $: Observable<boolean>;
  /**
   * The operator function that will update the loading observable.
   */
  readonly track: <T>() => MonoTypeOperatorFunction<T>;
};
```

```ts
import { createLoadingStore } from 'ngx-reactive-loading';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

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

  readonly isAdding$: Observable<boolean> = this.loadingStore[ExampleComponentActions.Add].$;
  readonly isReloading$: Observable<boolean> = this.loadingStore[ExampleComponentActions.Reload].$;
  readonly isLoading$: Observable<boolean> = someLoading([this.loadingStore]);

  constructor(private readonly http: HttpClient) {
  }

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

If you need a more sophisticated way to handle loading states, for a better integration with Angular dependency injection, you can 
provide the loading service that will expose the loading store api's.

### Loading service api

The LoadingService API includes convenient methods for handling loading state.

```ts
export type PropertyTuple<T extends PropertyKey> = readonly [...T[]];

export interface LoadingStoreOptions {
  /**
   * Isolate the service instance, removing the accesses to the parent and
   * root loading state.
   */
  standalone: boolean;
}

export interface LoadingService<T extends PropertyKey> {
  /**
   * The loading store state.
   */
  readonly state: LoadingStore<PropertyTuple<T>>;
  /**
   * Track all changes of the current LoadingService loading state properties.
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
  track<O>(key: T): MonoTypeOperatorFunction<O>

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
   * Track the changes of one or more given loading state. If no properties are
   * provided, all loading store property will be checked.
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
   * Used to automatically unsubscribe all
   * subscribers (only if service is provided attached in a Component)
   */
  ngOnDestroy(): void;
}
```

### Component based loading service
To instantiate the loading service into an angular component you must call the `LoadingService.componentProvider` method to
add the component provider. This loading service is subscribed to throughout through the lifecycle of the component.

```ts
import { LoadingService } from 'ngx-reactive-loading';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

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
  ) {
  }

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

### Module based loading service
There are some scenarios when you maybe need to provide the loading service at the root module or 
in a feature module, for example when using a global state manager like NGRX. You can do it with `.forRoot`/`.forChild` module
static methods.

#### Registering root loading service
To register a loading service at the root of your application, you must add 
the `ReactiveLoadingModule.forRoot()` method with the array of the properties that will be tracked.
```ts
import { ReactiveLoadingModule } from 'ngx-reactive-loading';

type RootLoadingActions = 'globalReload';

@NgModule({
  imports: [
    ReactiveLoadingModule.forRoot<RootLoadingActions>(['globalReload'])
  ],
})
export class AppModule {}
```

#### Registering feature loading service
For feature modules you must register your loading service by adding the `ReactiveLoadingModule.forChild()` method
in the imports of your `NgModule` with the service options.
```ts
import { ReactiveLoadingModule } from 'ngx-reactive-loading';

type TodoLoadingActions = 'addTodo' | 'removeTodo' | 'reloadTodo';

import { ReactiveLoadingModule } from 'ngx-reactive-loading';

@NgModule({
  imports: [
    ReactiveLoadingModule.forFeature(
      ['addTodo', 'removeTodo', 'reloadTodo'],
      {standalone: false} // This is the default behavior
    )
  ],
})
export class TodoModule {}
```

### Utils

- someLoading
  ```ts
  import {createLoadingStore, someLoading} from 'ngx-reactive-loading'; 
  
  const loadingStore = createLoadingStore(['add' | 'remove'])

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
  const isAddingOrRemoving$ = someLoading([loadingStore.remove, loadingStore.add.$]);
  ```

- withLoading - Update the subject at the first emission and on complete
  ```ts
  import {withLoading} from 'ngx-reactive-loading'; 
  import {of,Subject} from 'rxjs'; 
  
  const isLoading$ = new Subject<boolean>();
  const $ = of(1).pipe(delay(1000), withLoading(isLoading$));
  
  isLoading$.subscribe(result => {
    // Output 1: true
    // Output 2: false (after 1000ms)
  });
  
  $.subscribe(result => {
    // Output 1: 1
  })
  ```

