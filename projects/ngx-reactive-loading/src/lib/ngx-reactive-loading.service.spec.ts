import { TestBed } from '@angular/core/testing';

import { NgxReactiveLoadingService } from './ngx-reactive-loading.service';

describe('NgxReactiveLoadingService', () => {
  let service: NgxReactiveLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxReactiveLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
