import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { UIStore } from './store/ui-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'ngx-reactive-loading-demo';
  readonly vm$ = this.uiStore.vm$;

  constructor(
    private readonly uiStore: UIStore,
    private readonly router: Router
  ) {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(e => e.url)
      )
      .subscribe(url => this.uiStore.setCurrentUrl(url));
  }
}
