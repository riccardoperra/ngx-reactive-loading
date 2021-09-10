---
sidebar_position: 1
---

# Basic usage

The loading store is a key value object that allows handling <strong>multiple loading states defined
statically</strong> through your application.

## Creates a loading store

To create a loading store that handle the given loading states you have to invoke the `createLoadingStore` function passing the
properties that will be added to the store to be observed and updated.

```ts title="loading.state.ts"
import { createLoadingStore } from 'ngx-reactive-loading';

export enum LoadingActions {
  add = 'add',
  reload = 'reload',
}

const exampleLoadingStore = createLoadingStore([Actions.add, Actions.reload]);
```

## Reading the loading store state

```ts title="loading.state.ts"
import { delay, Observable, of } from 'rxjs';

const exampleLoadingStore = createLoadingStore(['add', 'reload']);
const source$ = of(0).pipe(delay(1000));

const isAdding$: Observable<boolean> = exampleLoadingStore.add.$;
const isReloading$: Observable<boolean> = exampleLoadingStore.reload.$;
```

## Update the loading store state

Like `withLoading` operator helper, you can perform a side effect for every emission on the source Observable, updating
the state of the key when the source is subscribed and when terminates on complete using the `track()` method.

```ts title="loading.state.ts"
import { of, delay } from 'rxjs';

const exampleLoadingStore = createLoadingStore(['add', 'reload']);
const source$ = of(0).pipe(delay(1000));

const sub = source$.pipe(exampleLoadingStore.add.track()).subscribe();
```

:::info Tip

Using `track()` is like combining tap and finalize operators to a cold observable.

```ts
import { tap, switchMap, Subject } from 'rxjs';
import { ajax } from 'rxjs/ajax';

const stream$ = new Subject<void>();
const httpCall$ = ajax('/');

const source$ = stream$.pipe(
  tap(() => loading$.next(true)),
  switchMap(() => httpCall$.pipe(finalize(() => loading$.next(false))))
);
```

:::
