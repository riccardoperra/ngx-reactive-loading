import { Component, Inject, OnInit } from '@angular/core';
import {
  HTTP_LOADING_REGISTRY,
  HTTP_LOADING_CONTEXT,
  LoadingRegistry,
  withHttpLoadingContext,
} from 'ngx-reactive-loading';
import { HttpClient, HttpContext } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: './app.component.html',
})
export class AppComponent implements OnInit {
  readonly someLoading$ = this.loadingRegistry.someLoading([
    'actionName',
    'actionName2',
  ]);
  readonly isActionNameLoading$ = this.loadingRegistry.isLoading('actionName');

  constructor(
    @Inject(HTTP_LOADING_REGISTRY)
    private readonly loadingRegistry: LoadingRegistry,
    private readonly http: HttpClient
  ) {}

  ngOnInit() {
    this.http
      .get('/', { context: withHttpLoadingContext('actionName2') })
      .subscribe();

    // Passing context manually
    this.http
      .get('/', {
        context: new HttpContext().set(HTTP_LOADING_CONTEXT, 'actionName'),
      })
      .subscribe();
  }
}
