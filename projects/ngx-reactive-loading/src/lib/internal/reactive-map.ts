import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

type ActionsType = 'add' | 'delete' | 'clear';

type ActionEvent<K extends PropertyKey, T> = {
  type: ActionsType;
  value: ReactiveMap<K, T>;
};

export class ReactiveMap<K extends PropertyKey, T> {
  private readonly internalMap = new Map<K, T>();
  private readonly actions$ = new Subject<ActionEvent<K, T>>();

  readonly changes$: Observable<ReactiveMap<K, T>> = this.actions$.pipe(
    map(action => action.value),
    startWith(this)
  );

  get(key: K): T | null {
    return this.internalMap.get(key) ?? null;
  }

  set(key: K, value: T): this {
    this.internalMap.set(key, value);
    this.actions$.next({ type: 'add', value: this });
    return this;
  }

  getMany(keys: K[]): (T | undefined)[] {
    return keys.map(k => this.internalMap.get(k));
  }

  setMany(values: [K, T][]): void {
    for (const [key, value] of values) {
      if (!this.internalMap.has(key)) {
        this.internalMap.set(key, value);
      }
    }
    this.actions$.next({ type: 'add', value: this });
  }

  delete(key: K): boolean {
    const removed = this.internalMap.delete(key);
    if (removed) {
      this.actions$.next({
        type: 'delete',
        value: this,
      });
    }
    return removed;
  }

  clear() {
    this.internalMap.clear();
    this.actions$.next({
      type: 'clear',
      value: this,
    });
  }

  keys(): K[] {
    return Array.from(this.internalMap.keys());
  }

  values(): T[] {
    return Array.from(this.internalMap.values());
  }
}
