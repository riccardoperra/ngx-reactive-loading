import { LoadingEvent, PropertyTuple } from '../model';
import { defer, merge, Observable } from 'rxjs';
import { map, shareReplay, skip } from 'rxjs/operators';
import { LoadingStore } from '../core';
import { LoadingStoreState } from '../internal/factory';

/**
 * Map loading state change to LoadingEvent object.
 */
export const toLoadingEvent = <T extends PropertyKey>(
  state: LoadingStore<PropertyTuple<T>>
): Observable<LoadingEvent> =>
  defer(() => {
    const entries = Object.entries<LoadingStoreState>(state);
    const skipN = entries.length;
    const events = entries.map(([type, state]) =>
      state.$.pipe(
        map(isLoading => ({ type, loading: isLoading } as LoadingEvent))
      )
    );
    return merge(...events).pipe(
      skip(skipN),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  });
