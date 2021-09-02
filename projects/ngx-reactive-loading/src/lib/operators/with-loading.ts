import { defer, MonoTypeOperatorFunction, pipe, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

export const withLoading = <T>(
  loadingSubject: Subject<boolean>
): MonoTypeOperatorFunction<T> =>
  pipe(source =>
    defer(() => {
      loadingSubject.next(true);
      return source.pipe(finalize(() => loadingSubject.next(false)));
    })
  );
