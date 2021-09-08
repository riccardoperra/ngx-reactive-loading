---
sidebar_position: 2
title: Loading service
---

# Working with Loading Service

If you need a more sophisticated way to handle loading states, for a better integration with Angular dependency
injection, you can use a loading service that will expose the [loading store](#loading-store) api's.

## Using with components

To use the loading service with angular components and dependency injection you must provide the service into the
component provider invoking the static `componentProvider` method of `LoadingService`. The loading service is subscribed
to throughout the lifecycle of the component, and it will manage all your loading subscriptions.

```ts title=example.component.ts
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
  readonly isReloading$: Observable<boolean> = this.loadingStoreState.reload.$;

  constructor(
    private readonly http: HttpClient,
    private readonly loadingStore: LoadingService<ComponentAction>
  ) {
  }
}
```

With this setup you get a `LoadingRegistry` with the following methods:

## API

### `load()`

Wrap the loading operator in the source observable. This allows to update the loading state of the given property
automatically after each emission and on complete.

```ts title=example.component.ts
import { LoadingService } from "ngx-reactive-loading";

type ComponentAction = 'add' | 'reload';

@Component({})
export class ExampleComponent {
  constructor(
    private readonly http: HttpClient,
    private readonly loadingStore: LoadingService<ComponentAction>
  ) {
  }

  add() {
    this.loadingStore
      .load(() => this.http.post('/', {}), 'add')
      .subscribe();
  }
}
```

### `track()`

Like loading store `track()`, performs a side effect for every emission on the source Observable, updating the state of
the key when the source is subscribed and when terminates on complete.

```ts title=example.component.ts
import { LoadingService } from "ngx-reactive-loading";
import { OnInit } from "@angular/core";

type ComponentAction = 'add' | 'reload';

@Component({})
export class ExampleComponent implements OnInit {
  constructor(
    private readonly http: HttpClient,
    private readonly loadingStore: LoadingService<ComponentAction>
  ) {
  }

  ngOnInit(): void {
    this.http.post('/', {})
      .pipe(this.loadingService.track('add'))
      .subscribe();
  }
}
```

### `isLoading()`

Listen to the changes of the given loading state property.

```ts title=example.component.ts
import { LoadingService } from "ngx-reactive-loading";

type ComponentAction = 'add' | 'reload';

@Component({})
export class ExampleComponent {
  readonly isAdding$: Observable<boolean> = this.loadingService.isLoading('add');

  constructor(private readonly loadingStore: LoadingService<ComponentAction>) {
  }
}
```

### `someLoading()`

Listen to the state changes of the given properties and return true if it finds a state which is currently loading.

```ts title=example.component.ts
import { LoadingService } from "ngx-reactive-loading";

type ComponentAction = 'add' | 'reload';

@Component({})
export class ExampleComponent {
  readonly isAddingOrDeleting$: Observable<boolean> = 
    this.loadingService.someLoading(['add', 'reload']);
  
  constructor(private readonly loadingStore: LoadingService<ComponentAction>) {
  }
}
```

:::info someLoading can listen to all properties!
If you need to listen to all changes of the loading store state, you can provide an empty parameter
to the `someLoading` method.
:::


## Using with modules

There are some scenarios when you may need to provide the loading service at the root or in a feature module, for
example when using a global state manager like NGRX. You can do it calling the `ReactiveLoadingModule.forRoot`
or `ReactiveLoadingModule.forChild` methods.

### Registering root loading service

To register a loading service at the root of your application, you must add the `ReactiveLoadingModule.forRoot()` method
with the array of the properties that will be tracked.

```ts title=app.module.ts
import { ReactiveLoadingModule } from 'ngx-reactive-loading';

type RootLoadingActions = 'globalReload';

@NgModule({
  imports: [
    ReactiveLoadingModule.forRoot<RootLoadingActions>(['globalReload']),
  ],
})
export class AppModule {}
```

### Registering feature loading service

For feature modules you must register your loading service by adding the `ReactiveLoadingModule.forChild()` method in
the imports of your `NgModule` with the service options.

```ts title=todo.module.ts
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

### Custom module configuration

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

#### Event logger

With the event logger, there will be a default eventListener to the loading store that will log all loading property
changes automatically in the console. Providing the `name` option, the log will include also that will name it.

```ts title=feature.module.ts
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
