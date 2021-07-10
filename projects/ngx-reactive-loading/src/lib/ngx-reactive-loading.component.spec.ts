import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxReactiveLoadingComponent } from './ngx-reactive-loading.component';

describe('NgxReactiveLoadingComponent', () => {
  let component: NgxReactiveLoadingComponent;
  let fixture: ComponentFixture<NgxReactiveLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxReactiveLoadingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxReactiveLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
