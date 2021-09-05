import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { UIStore } from './store/ui-store';
import { Location } from '@angular/common';

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
    private readonly location: Location
  ) {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(() => this.location.path())
      )
      .subscribe(url => this.uiStore.setCurrentUrl(url));
  }
}
