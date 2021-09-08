---
sidebar_position: 1
---

# Basic usage

The loading store is a key value object that allows handling <strong>multiple loading states defined
statically</strong> through your application.

Create a loading store that persist the given loading states invoking the `createLoadingStore` function specifying the
properties that will be observed and updated.

## Creates a loading store

Create a loading store that persist the given loading states invoking the `createLoadingStore` function passing the
properties that will be observed and updated.

```ts title="loading.state.ts"
import { createLoadingStore } from "ngx-reactive-loading";

export enum LoadingActions {
  add = 'add',
  reload = 'reload'
}

const exampleLoadingStore = createLoadingStore([
  Actions.add,
  Actions.reload
]);
```

## Update the loading store state

Like `withLoading` operator helper, you can perform a side effect for every emission on the source Observable, updating
the state of the key when the source is subscribed and when terminates on complete using the `track()` method.

```ts title="loading.state.ts"
import { of, delay } from "rxjs";

const exampleLoadingStore = createLoadingStore(['add', 'reload']);
const source$ = of(0).pipe(delay(1000));

const sub = source$
  .pipe(exampleLoadingStore.add.track())
  .subscribe();
```

:::info Something about track()

Using `track()` is like of combining tap and finalize operators between a cold observable!

```ts
import { tap, switchMap, Subject } from "rxjs";
import { ajax } from "rxjs/ajax";

const stream$ = new Subject<void>();
const httpCall$ = ajax('/');

const source$ =
  stream$
    .pipe(
      tap(() => loading$.next(true)),
      switchMap(() => httpCall$.pipe(finalize(() => loading$.next(false))))
    );
```

:::

## Reading the loading store state

```ts title="loading.state.ts"
import { delay, Observable, of } from "rxjs";

const exampleLoadingStore = createLoadingStore(['add', 'reload']);
const source$ = of(0).pipe(delay(1000));

const isAdding$: Observable<boolean> = exampleLoadingStore.add.$;
const isReloading$: Observable<boolean> = exampleLoadingStore.reload.$;
```
