---
sidebar_position: 3
---

# untilLoading()

Listen to all triggers, then wait for result and end loading upon emit.

```ts
import {Observable} from 'rxjs';

const untilLoading: (
  trigger$: readonly Observable<unknown>[],
  content$: readonly Observable<unknown>[]
): Observable<boolean>;
```

- trigger$ - Array of observables that will be listened. When a new value is emitted, the
  returned observable will emit a `true` value;
- content$ - Array of observables that will be listened. When a new value is emitted, the
  returned observable will emit a `false` value;

## Example

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
