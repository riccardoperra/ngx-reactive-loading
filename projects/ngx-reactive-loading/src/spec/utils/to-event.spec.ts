import { Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { createLoadingStore } from '../../lib/core/create-loading-store';
import { toLoadingEvent } from '../../lib/utils/to-event';

describe('toLoadingEvent', () => {
  it(
    'should map to loading event',
    marbles(m => {
      const loadingStore = createLoadingStore<['add']>(['add']);

      const first$: Observable<number> = m
        .cold('---(a|)', { a: 0 })
        .pipe(loadingStore.add.track());

      const events = toLoadingEvent(loadingStore);

      m.expect(events).toBeObservable('a--b', {
        a: { type: 'add', loading: true },
        b: { type: 'add', loading: false },
      });

      m.expect(first$).toBeObservable('---(a|)', { a: 0 });
    })
  );
});
