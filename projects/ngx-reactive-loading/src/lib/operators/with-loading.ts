import { defer, MonoTypeOperatorFunction, pipe, Subject, finalize } from 'rxjs';

/**
 * Like `tap` operator, perform a side effect for every emission on the source Observable,
 * updating the given subject when the source is subscribed and when terminates on complete
 *
 * @param loadingSubject The subject that will be updated
 */
export const withLoading = <T>(
  loadingSubject: Subject<boolean>
): MonoTypeOperatorFunction<T> =>
  pipe(source =>
    defer(() => {
      loadingSubject.next(true);
      return source.pipe(finalize(() => loadingSubject.next(false)));
    })
  );
