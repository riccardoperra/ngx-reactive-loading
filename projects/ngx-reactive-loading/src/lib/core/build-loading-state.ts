import { LoadingStoreState } from '../model';
import { BehaviorSubject, Subject } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { withLoading } from '../operators';

export function buildLoadingState(): LoadingStoreState {
  const loadingSubject = new BehaviorSubject<boolean>(false);
  const destroy$ = new Subject<void>();

  return {
    $: loadingSubject
      .asObservable()
      .pipe(
        shareReplay({ refCount: true, bufferSize: 1 }),
        takeUntil(destroy$)
      ),
    track: <T>() => withLoading(loadingSubject),
    destroy: () => {
      destroy$.next();
      destroy$.complete();
    },
  };
}
