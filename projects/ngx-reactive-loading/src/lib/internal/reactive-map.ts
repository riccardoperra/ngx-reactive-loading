import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

type ActionsType = 'add' | 'delete' | 'clear';

type ActionEvent<K extends PropertyKey, T> = {
  type: ActionsType;
  value: ReactiveMap<K, T>;
};

export class ReactiveMap<K extends PropertyKey, T> extends Map<K, T> {
  private readonly actions$ = new Subject<ActionEvent<K, T>>();

  readonly changes$: Observable<ReactiveMap<K, T>> = this.actions$.pipe(
    map(action => action.value),
    startWith(this)
  );

  delete(key: K): boolean {
    const removed = super.delete(key);
    if (removed) {
      this.actions$.next({
        type: 'delete',
        value: this,
      });
    }
    return removed;
  }

  set(key: K, value: T): this {
    super.set(key, value);
    this.actions$.next({ type: 'add', value: this });
    return this;
  }

  getMany(keys: K[]): (T | undefined)[] {
    return keys.map(k => this.get(k));
  }

  setMany(values: [K, T][]): void {
    for (const [key, value] of values) {
      if (!this.has(key)) {
        super.set(key, value);
      }
    }
    this.actions$.next({ type: 'add', value: this });
  }
}
