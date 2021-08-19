import { merge, race, Subject } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import {
  concatMap,
  first,
  map,
  mapTo,
  switchMap,
  switchMapTo,
} from 'rxjs/operators';
import { untilLoading } from '../../lib/utils';

describe('untilLoading', () => {
  it(
    'single trigger',
    marbles(m => {
      const action$ = m.cold('--a');
      const call$ = m.cold('--a', { a: 'finish' });
      const source$ = action$.pipe(switchMap(() => call$));

      const loading = untilLoading([action$], [source$]);

      m.expect(source$).toBeObservable('----a', { a: 'finish' });

      m.expect(loading).toBeObservable('--a---b', {
        a: true,
        b: false,
      });
    })
  );
});
