import { LoadingService } from 'ngx-reactive-loading';
import { Component } from '@angular/core';
import { of } from 'rxjs';

@Component({
  template: `<app-hello></app-hello>`,
})
export class AppComponent {
  constructor(private readonly loadingService: LoadingService) {
    of(1).pipe(loadingService.track('prop1')).subscribe();
  }
}
