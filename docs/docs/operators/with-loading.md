---
sidebar_position: 2
---

# withLoading()

Like `tap` operator, perform a side effect for every emission on the source Observable,
updating the given subject when the source is subscribed and when terminates on complete.

```ts
import {Subject, MonoTypeOperatorFunction} from 'rxjs';

const withLoading: <T>(
    loadingSubject: Subject<boolean
) => MonoTypeOperatorFunction<T>;
```

- `loadingSubject` - The subject that will be updated when the source subscribe and when terminates on complete.

## Example

```ts
import { withLoading } from 'ngx-reactive-loading';
import { of, Subject } from 'rxjs';
import { delay, switchMap } from 'rxjs';

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
