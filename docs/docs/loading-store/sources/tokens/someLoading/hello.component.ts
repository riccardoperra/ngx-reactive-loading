import { SOME_LOADING } from 'ngx-reactive-loading';
import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';

@Component({ template: ``, selector: 'app-hello' })
export class HelloComponent {
  constructor(
    @Inject(SOME_LOADING) private readonly someLoading$: Observable<boolean>
  ) {}
}
