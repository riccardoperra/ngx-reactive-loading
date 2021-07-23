import { fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { createLoadingStore, someLoading, withLoading } from '../../public-api';

describe('someLoading', () => {
  it('should return if there is loading', fakeAsync(() => {
    const firstLoading$ = new BehaviorSubject<boolean>(false);
    const first$: Observable<number> = timer(1000).pipe(
      withLoading(firstLoading$)
    );

    const secondLoading$ = new BehaviorSubject<boolean>(false);
    const second$: Observable<number> = timer(2000).pipe(
      withLoading(secondLoading$)
    );

    const spy = jasmine.createSpy();

    combineLatest([first$, second$]).subscribe();

    someLoading([firstLoading$, secondLoading$]).subscribe(spy);

    expect(spy).toHaveBeenCalledWith(true);

    tick(1000);

    expect(spy).toHaveBeenCalledWith(true);

    tick(2000);

    expect(spy).toHaveBeenCalledWith(false);
  }));

  it('should return if there is loading with loading store states', fakeAsync(() => {
    const loadingStore = createLoadingStore<['add', 'delete']>([
      'add',
      'delete',
    ]);

    const first$: Observable<number> = timer(1000).pipe(
      loadingStore.add.track()
    );

    const second$: Observable<number> = timer(1000).pipe(
      loadingStore.delete.track()
    );

    const spy = jasmine.createSpy();

    combineLatest([first$, second$]).subscribe();

    someLoading([loadingStore.add, loadingStore.delete.$]).subscribe(spy);

    expect(spy).toHaveBeenCalledWith(true);

    tick(1000);

    expect(spy).toHaveBeenCalledWith(true);

    tick(2000);

    expect(spy).toHaveBeenCalledWith(false);
  }));

  it('should return if there is some loading store loading', fakeAsync(() => {
    const loadingStore = createLoadingStore<['add', 'delete']>([
      'add',
      'delete',
    ]);

    const first$: Observable<number> = timer(1000).pipe(
      loadingStore.add.track()
    );

    const second$: Observable<number> = timer(1000).pipe(
      loadingStore.delete.track()
    );

    const spy = jasmine.createSpy();

    combineLatest([first$, second$]).subscribe();

    someLoading([loadingStore]).subscribe(spy);

    expect(spy).toHaveBeenCalledWith(true);

    tick(1000);

    expect(spy).toHaveBeenCalledWith(true);

    tick(2000);

    expect(spy).toHaveBeenCalledWith(false);
  }));

  it('should no update if there is no loading', fakeAsync(() => {
    const loadingStore = createLoadingStore<['add']>(['add']);

    const spy = jasmine.createSpy();

    const value: any = true;
    someLoading([value]).subscribe(spy);

    expect(spy).not.toHaveBeenCalled();
  }));
});
