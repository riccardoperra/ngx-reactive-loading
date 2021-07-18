import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { SidebarRoute, UIStore } from '../../../store/ui-store';
import { Router } from '@angular/router';
import { defer } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly routes$ = this.uiStore.routes$;
  readonly trackBy: TrackByFunction<SidebarRoute> = (_, route) => route.url;

  constructor(
    private readonly uiStore: UIStore,
    private readonly router: Router
  ) {}

  navigate(route: SidebarRoute) {
    defer(() => this.router.navigateByUrl(route.url))
      .pipe(filter(navigated => navigated))
      .subscribe(() => this.uiStore.setPageTitle(route.label));
  }
}
