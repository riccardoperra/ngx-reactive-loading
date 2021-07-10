import { BehaviorSubject, defer, MonoTypeOperatorFunction, pipe } from 'rxjs';
import { finalize } from 'rxjs/operators';

export const withLoading = <T>(
  loadingSubject: BehaviorSubject<boolean>
): MonoTypeOperatorFunction<T> =>
  pipe(source =>
    defer(() => {
      loadingSubject.next(true);
      return source.pipe(finalize(() => loadingSubject.next(false)));
    })
  );
