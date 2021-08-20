import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { defer, of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoadingService, ReactiveLoadingModule } from '../../public-api';

describe('loading directive', () => {
  let fixture: ComponentFixture<any>;

  function getComponent(): TestComponent {
    return fixture.componentInstance as TestComponent;
  }

  afterEach(() => {
    fixture = null!;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ReactiveLoadingModule],
    });
  });

  it('should render main template', fakeAsync(() => {
    const template = `<button *loading="'prop1'">Test</button>`;

    fixture = createTestComponent(template);
    fixture.detectChanges();

    const sub = getComponent().load('prop1', 1000);

    tick(500);

    expect(fixture.debugElement.queryAll(By.css('button')).length).toEqual(0);

    tick(1000);

    const buttonQuery = fixture.debugElement.queryAll(By.css('button'));
    expect(buttonQuery.length).toEqual(1);

    const button = buttonQuery[0].nativeElement as HTMLElement;
    expect(button.innerHTML).toBe('Test');

    sub.unsubscribe();
  }));

  it('should work with multiple loading', fakeAsync(() => {
    const template = `<button *loading="['prop1', 'prop2']">Test</button>`;
    let sub: Subscription | null = null;
    let sub2: Subscription | null = null;

    fixture = createTestComponent(template);
    fixture.detectChanges();

    sub = getComponent().load('prop1', 500);
    sub2 = getComponent().load('prop2', 1000);

    tick(250);

    expect(fixture.debugElement.queryAll(By.css('button')).length).toEqual(0);

    tick(500);

    expect(fixture.debugElement.queryAll(By.css('button')).length).toEqual(0);

    tick(2000);

    const buttonQuery = fixture.debugElement.queryAll(By.css('button'));
    expect(buttonQuery.length).toEqual(1);

    const button = buttonQuery[0].nativeElement as HTMLElement;
    expect(button.innerHTML).toBe('Test');

    sub.unsubscribe();
    sub2.unsubscribe();
  }));

  it('should render else template', fakeAsync(() => {
    const template = `
      <button *loading="'prop2'; else elseBlock">Test</button>
      <ng-template #elseBlock><span>Loading...</span></ng-template>
    `;

    fixture = createTestComponent(template);
    fixture.detectChanges();

    const sub = getComponent().load('prop2', 1500);

    tick(300);

    let buttonQuery = fixture.debugElement.queryAll(By.css('button'));
    let spanQuery = fixture.debugElement.queryAll(By.css('span'));

    expect(buttonQuery.length).toEqual(0);
    expect(spanQuery.length).toEqual(1);
    const elseTemplate = spanQuery[0].nativeElement as HTMLSpanElement;
    expect(elseTemplate.innerHTML).toBe('Loading...');

    tick(2000);

    buttonQuery = fixture.debugElement.queryAll(By.css('button'));
    spanQuery = fixture.debugElement.queryAll(By.css('span'));

    expect(buttonQuery.length).toEqual(1);
    expect(spanQuery.length).toEqual(0);
    const button = buttonQuery[0].nativeElement as HTMLElement;
    expect(button.innerHTML).toBe('Test');

    sub.unsubscribe();
  }));

  it('should throw error if given property is invalid', fakeAsync(() => {
    const template = `
      <button *loading="['invalid']; else elseBlock">Test</button>
      <ng-template #elseBlock><span>Loading...</span></ng-template>
    `;

    expect(() => {
      fixture = createTestComponent(template);
      fixture.detectChanges();
      fixture.destroy();
      flush();
    }).toThrowError('[LoadingService] Property invalid not found');
  }));
});

type TestComponentLoadingActions = 'prop1' | 'prop2';

@Component({
  selector: 'lib-test-cmp',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    LoadingService.componentProvider<TestComponentLoadingActions>(
      ['prop1', 'prop2'],
      { standalone: true }
    ),
  ],
})
class TestComponent {
  constructor(
    readonly loadingService: LoadingService<TestComponentLoadingActions>
  ) {}

  load(prop: TestComponentLoadingActions, delayN: number): Subscription {
    return this.loadingService
      .load(
        defer(() => of(1).pipe(delay(delayN))),
        prop
      )
      .subscribe();
  }
}

function createTestComponent(
  template: string
): ComponentFixture<TestComponent> {
  return TestBed.overrideComponent(TestComponent, {
    set: { template: template },
  }).createComponent(TestComponent);
}
