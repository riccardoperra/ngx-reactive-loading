import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

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
 *     of(1).pipe(loadingService.track('prop1')).subscribe();
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
 *  imports: [ReactiveLoadingModule.forRoot(['prop1'])],
 * })
 export class AppModule {}
 * ```
 */
export const SOME_LOADING = new InjectionToken<Observable<boolean>>(
  '[ngx-reactive-loading] loadingService/someLoading'
);
