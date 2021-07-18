> Better loading handling in Angular applications with RxJS

## Table of contents

- [Table of contents](#table-of-contents)
- [Getting started](#getting-started)
- [Basic usage](#basic-usage)
- [Working with loading service](#working-with-loading-service)
  - [Loading service api](#loading-service-api)
  - [Providing in components](#component-based-loading-service)
  - [Providing in modules](#module-based-loading-service)
- [Utils](#utils)
## Getting started

---

Install with npm

```
npm i rxjs-reactive-loading
```

Or with yarn

```
yarn add rxjs-reactive-loading
```

## Basic usage

---

The loading store is the core of this library, it allows handling easily different loading states through your
application.

To create a loading store that will track all your loading states, you must call the `createLoadingStore` function
specifying the properties that will be tracked.

```ts
type LoadingStore<K extends readonly [...PropertyKey[]]> = {
  [Key in K[number]]: Readonly<LoadingStoreState>;
};

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
import {createLoadingStore} from 'ngx-reactive-loading';
import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

enum ExampleComponentActions {
  Add = 'add',
  Reload = 'reload',
}

@Component({
  selector: 'app-example',
  template: `
    <div>
      Add: <span>{{ isAdding$ | async }}</span>
    </div>

    <div>
      Add: <span>{{ isReloading$ | async }}</span>
    </div>
  `,
})
export class ExampleComponent implements OnInit {
  readonly loadingStore = createLoadingStore([
    ExampleComponentActions.Add,
    ExampleComponentActions.Reload,
  ]);

  readonly isAdding$ = this.loadingStore[ExampleComponentActions.Add].$;
  readonly isReloading$ = this.loadingStore[ExampleComponentActions.Reload].$;

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

---

If you need a more sophisticated loading handling, and for a better integration with Angular dependency injection, it's
possible to initialize a loading service that will expose the loading store api's with some strict-typed helpers.

### Loading service api

The LoadingService API includes convenient methods for handling loading state.

```ts
/**
 * Used internally to type given property into a tuple.
 */
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
   * Track all changes of each current LoadingService loading state property.
   */
  readonly events$: Observable<LoadingEvent>;

  /**
   * Helper to provide a LoadingService into a component. His use is necessary
   * to provide each constructor property to initialize the service in
   * the right way.
   *
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
   * default rxjs distinctUntilChange operator and the value
   * is shared among all subscribers (shareReplay({refCount: true, bufferSize: 1}))
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
The current only way to provide a new instance of loading service into an angular component is using 
the static helper method `LoadingService.componentProvider` into the component provider.
This allows to define the properties the service will track, and the options 
to change the behaviour of the service.

Using this approach, thanks to angular DI it's possible to inject the same loadingService instance in
nested components allowing better communication with service. This doesn't mean that you should always
inject the loading service in nested component. Consider this approach if you want to avoid prop
drilling or if you use want to use it in the same context.

```ts
import {LoadingService} from 'ngx-reactive-loading';
import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

type ComponentAction = 'add' | 'reload';

@Component({
  selector: 'app-example',
  template: `
    <div>
      Add: <span>{{ loadingStoreState.add.$ | async }}</span>
    </div>

    <div>
      Add: <span>{{ loadingStoreState.reload.$ | async }}</span>
    </div>
  `,
  providers: [
    LoadingService.componentProvider<ComponentAction>(['add', 'reload']),
  ],
})
export class ExampleComponent implements OnInit {
  readonly loadingStoreState = this.loadingStore.state;

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
in a specific lazy-loaded module to be able to inject the service wherever you want.
Since this library expose the .forRoot/.forChild pattern, you are able to do it.

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

