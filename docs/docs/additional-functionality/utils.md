---
sidebar_position: 1
---

# Helpers

ngx-reactive-loading comes with built-in functions that can help you to handle the loading states of your application.
These functions are standalone, and they do not force you to use all the features of this library.

## Operators

### `withLoading()`

Like `tap` operator, perform a side effect for every emission on the source Observable,
updating the given subject when the source is subscribed and when terminates on complete.

```ts
import { withLoading } from 'ngx-reactive-loading';
import { of, Subject } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

const isLoading$ = new Subject<boolean>();
const refresh$ = new Subject<void>();

const source$ = of(null).pipe(delay(1000));

const subscription = refresh$
  .pipe(switchMap(() => source$.pipe(withLoading(isLoading$))))
  .subscribe();

// Result
isLoading$.subscribe((result: boolean) => {
  // 1st emission (Output after refresh$ trigger): true
  // 2nd emission (completed): false
});

refresh$.next();
```

## Observable creation functions

### `someLoading()`

Listen to the state changes of the given properties and return true if it finds a state which is currently loading

#### Listen to loading store or properties changes

```ts
import { createLoadingStore, someLoading } from 'ngx-reactive-loading';

// Creates the loading store
const loadingStore = createLoadingStore(['add', 'remove', 'clear']);

// Observes loading store state
const isSomeLoading$ = someLoading([loadingStore]);

// Observe loading properties state
const isAddingOrClearing$ = someLoading([loadingStore.add, loadingStore.clear]);
```

#### Listen to observable changes

```ts
import { createLoadingStore, someLoading } from 'ngx-reactive-loading';
import { Subject } from 'rxjs';

// Creates the loading subjects
const loadingAdd$ = new Subject<boolean>();
const loading$ = new Subject<boolean>();

// Observes the observables states
const isLoading = someLoading([loadingAdd$, loading$]);
```

:::info someLoading signature overloading

You can pass both properties and loading store states as `someLoading` parameters!

:::

### `untilLoading()`

Listen to all triggers, then wait for result and end loading upon emit.

```ts
import { untilLoading } from 'ngx-reactive-loading';
import { BehaviorSubject, switchMap, catchError, of, share } from 'rxjs';

const reload$ = new BehaviorSubject<null>(null);

const items$ = this.reload$.pipe(
  switchMap(() =>
    this.service.getList().pipe(
      catchError(() => of(null)),
      share()
    )
  )
);

const isLoading$ = untilLoading([reload$], [items$]);
```
