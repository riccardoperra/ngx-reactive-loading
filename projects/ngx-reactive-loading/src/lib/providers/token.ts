import { Component, Inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingRegistry } from '../model';

/**
 * Automatically provided when providing the loading service in a component
 * or in modules. When injected, it allows you to observe the changes to the state between all service
 * loading property, like the `someLoading` helper function.
 *
 * @example
 * ```ts
 * import { ReactiveLoadingModule, LoadingService } from 'ngx-reactive-loading';
 * import { Inject, Component, NgModule } from '@angular/core';
 * import { of, Observable } from 'rxjs';
 *
 * @Component({ template: `<app-hello></app-hello>` })
 * export class AppComponent {
 *   constructor(private readonly loadingService: LoadingService) {
 *     of(1).pipe(loadingService.track("prop1")).subscribe();
 *   }
 * }
 *
 * @Component({ template: ``, selector: 'app-hello' })
 * export class HelloComponent {
 *   constructor(@Inject(SOME_LOADING) private readonly someLoading$: Observable<boolean>) {
 *   }
 * }
 *
 * @NgModule({
 *  declarations: [AppComponent, HelloComponent],
 *  imports: [ReactiveLoadingModule.forRoot(["prop1"])],
 * })
 export class AppModule {}
 * ```
 */
export const SOME_LOADING = new InjectionToken<Observable<boolean>>(
  '[ngx-reactive-loading] loadingService/someLoading'
);

/**
 * A provider token that represents the registered loading registry object.
 * @example
 * ```ts
 * import { NgModule } from '@angular/core';
 * import { BrowserModule } from '@angular/platform-browser';
 * import { HttpModule } from '@angular/http';
 * import { AppComponent } from './app.component';
 * import { createLoadingRegistry, LOADING_REGISTRY } from "ngx-reactive-loading";
 *
 * @NgModule({
 *  imports: [BrowserModule, HttpModule],
 *  declarations: [AppComponent],
 *  bootstrap: [AppComponent],
 *  providers: [{ provide: LOADING_REGISTRY, useFactory: createLoadingRegistry }],
 * })
 * export class AppModule {}
 *
 * @Component({selector: 'app-root', template: ''})
 * export class AppComponent {
 *  constructor(@Inject(LOADING_REGISTRY) readonly registry: LoadingRegistry) {
 *  }
 * }
 * ```
 */
export const LOADING_REGISTRY = new InjectionToken<LoadingRegistry>(
  '[ngx-reactive-loading] dynamicLoadingStore'
);
