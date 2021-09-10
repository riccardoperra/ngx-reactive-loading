---
sidebar_position: 1
---

# someLoading()

Listen to the state changes of the given properties and return true if it finds a state which is currently loading.

```ts
import {Observable} from 'rxjs';
import {LoadingStore, LoadingStoreState} from 'ngx-reactive-loading';

const someLoading: <
  Loaders extends readonly [
    ...(readonly (
      | LoadingStore<readonly PropertyKey[]>
      | LoadingStoreState
      | Observable<boolean>
    )[])
  ]
>(loaders: Loaders): Observable<boolean>;
```

- `loaders` - The array of observables, loading store or states that will be listened.

## Example

### Listen to loading store or properties changes

```ts
import { createLoadingStore, someLoading } from 'ngx-reactive-loading';

// Creates the loading store
const loadingStore = createLoadingStore(['add', 'remove', 'clear']);

// Observes loading store state
const isSomeLoading$ = someLoading([loadingStore]);

// Observe loading properties state
const isAddingOrClearing$ = someLoading([loadingStore.add, loadingStore.clear]);
```

### Listen to observable changes

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
