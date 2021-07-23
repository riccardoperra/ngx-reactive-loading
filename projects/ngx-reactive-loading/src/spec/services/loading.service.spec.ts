import { fakeAsync, tick } from '@angular/core/testing';
import { combineLatest, of, timer } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoadingService } from '../../public-api';
import { marbles } from 'rxjs-marbles';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService(
      ['prop1', 'prop2'],
      { standalone: true },
      null
    );
  });

  it('should create loading store', () => {
    const expected = ['prop1', 'prop2'];
    expect(Object.keys(service.state)).toEqual(expected);
  });

  it('isLoading', fakeAsync(() => {
    const spy = jasmine.createSpy();

    service.load(timer(1000), 'prop1').subscribe();

    service.isLoading('prop1').subscribe(spy);

    expect(spy).toHaveBeenCalledWith(true);

    tick(1000);

    expect(spy).toHaveBeenCalledWith(false);
  }));

  it('track', fakeAsync(() => {
    const spy = jasmine.createSpy();

    timer(1000).pipe(service.track('prop1')).subscribe();

    service.isLoading('prop1').subscribe(spy);

    expect(spy).toHaveBeenCalledWith(true);

    tick(1000);

    expect(spy).toHaveBeenCalledWith(false);
  }));

  it('should throw key not found on track', fakeAsync(() => {
    expect(() => {
      timer(1000).pipe(service.track('notFoundProp')).subscribe();
    }).toThrowError(Error);
  }));

  it('someLoading by props', fakeAsync(() => {
    const spy = jasmine.createSpy();

    combineLatest([
      service.load(timer(1000), 'prop1'),
      service.load(timer(2000), 'prop2'),
    ]).subscribe();

    service.someLoading(['prop1', 'prop2']).subscribe(spy);

    expect(spy).toHaveBeenCalledWith(true);

    tick(1000);

    expect(spy).toHaveBeenCalledWith(true);

    tick(2000);

    expect(spy).toHaveBeenCalledWith(false);
  }));

  it('someLoading by all props', fakeAsync(() => {
    const spy = jasmine.createSpy();

    combineLatest([
      service.load(timer(1000), 'prop1'),
      service.load(timer(2000), 'prop2'),
    ]).subscribe();

    service.someLoading().subscribe(spy);

    expect(spy).toHaveBeenCalledWith(true);

    tick(1000);

    expect(spy).toHaveBeenCalledWith(true);

    tick(2000);

    expect(spy).toHaveBeenCalledWith(false);
  }));

  it('someLoading with parent', fakeAsync(() => {
    const spy = jasmine.createSpy();
    const parentService = new LoadingService(
      ['parent1'],
      { standalone: true },
      null
    );
    service = new LoadingService(
      ['child1'],
      { standalone: false },
      parentService
    );

    combineLatest([
      parentService.load(timer(1000), 'parent1'),
      service.load(timer(2000), 'child1'),
    ]).subscribe();

    service.someLoading(['parent1']).subscribe(spy);

    expect(spy).toHaveBeenCalledWith(true);

    tick(1000);

    expect(spy).toHaveBeenCalledWith(true);

    tick(2000);

    expect(spy).toHaveBeenCalledWith(false);
  }));

  it(
    'would emit a new value for each property changed',
    marbles(m => {
      const prop1$ = service.load(of('prop1').pipe(delay(10)), 'prop1');
      const prop2$ = service.load(of('prop2').pipe(delay(15)), 'prop2');

      m.expect(service.events$).toBeObservable(
        m.hot('(ab)------c----d', {
          a: { type: 'prop1', loading: true },
          b: { type: 'prop2', loading: true },
          c: { type: 'prop1', loading: false },
          d: { type: 'prop2', loading: false },
        })
      );

      m.expect(prop1$).toBeObservable('----------(a|)', { a: 'prop1' });
      m.expect(prop2$).toBeObservable('---------------(b|)', { b: 'prop2' });
    })
  );

  it('complete when loadingService is destroyed', (doneFn: DoneFn) => {
    const isLoading = service.someLoading([]);

    isLoading.subscribe({
      complete: () => doneFn(),
    });

    service.ngOnDestroy();
  });
});
