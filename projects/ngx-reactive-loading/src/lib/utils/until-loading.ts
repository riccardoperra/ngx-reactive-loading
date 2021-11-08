import { merge, Observable, first, mapTo, startWith, switchMap } from 'rxjs';

/**
 * Listen to all triggers, then wait for result and end loading upon emit.
 *
 * @param trigger$
 * @param content$
 *
 * @example
 * ```ts
 *
 * const reload$ = new BehaviorSubject<null>(null);
 * const add$ = new Subject<string>();
 *
 * const items$ = this.reload$.pipe(
 *  switchMap(() =>
 *    this.service.getList().pipe(
 *      catchError(() => of(null)
 *    ),
 *  share()
 * );
 *
 * const loading = untilLoading([reload$, add$], [items$]);
 * ```
 */
export const untilLoading = (
  trigger$: readonly Observable<unknown>[],
  content$: readonly Observable<unknown>[]
): Observable<boolean> => {
  return merge(...trigger$).pipe(
    switchMap(() =>
      merge(...content$).pipe(first(), mapTo(false), startWith(true))
    )
  );
};
