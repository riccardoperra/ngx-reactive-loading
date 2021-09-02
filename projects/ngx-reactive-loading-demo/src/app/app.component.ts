import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { UIStore } from './store/ui-store';
import { HttpClient } from '@angular/common/http';
import {
  HTTP_LOADING_REGISTRY,
  LoadingRegistry,
  withHttpLoadingContext,
} from 'ngx-reactive-loading';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'NGX Reactive Loading';
  readonly vm$ = this.uiStore.vm$;

  constructor(
    private readonly uiStore: UIStore,
    private readonly router: Router,
    @Inject(HTTP_LOADING_REGISTRY)
    readonly httpLoadingRegistry: LoadingRegistry,
    private readonly http: HttpClient
  ) {
    this.httpLoadingRegistry.registry$.subscribe(console.log);
    this.http
      .get('/', { context: withHttpLoadingContext('loader') })
      .subscribe();

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(e => e.url)
      )
      .subscribe(url => this.uiStore.setCurrentUrl(url));
  }
}
