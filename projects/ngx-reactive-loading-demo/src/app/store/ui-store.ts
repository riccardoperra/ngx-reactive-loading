import { Injectable } from '@angular/core';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ROUTES } from '../shared/constants/routes';

export type SidebarRoute = { label: string; url: string };

interface UIStoreState {
  openSidebar: boolean;
  pageTitle: string | null;
  currentUrl: string;
  routes: SidebarRoute[];
}

export const initialState: UIStoreState = {
  openSidebar: true,
  pageTitle: null,
  currentUrl: '',
  routes: ROUTES.map(({ label, url }) => ({ label, url })),
};

@Injectable({ providedIn: 'any' })
export class UIStore extends ComponentStore<UIStoreState> {
  readonly openSidebar$ = this.select(({ openSidebar }) => openSidebar);
  readonly pageTitle$ = this.select(({ pageTitle }) => pageTitle);
  readonly routes$ = this.select(({ routes }) => routes);
  readonly currentUrl$ = this.select(({ currentUrl }) => currentUrl);

  readonly vm$: Observable<{
    openSidebar: boolean;
    pageTitle: string | null;
    routes: SidebarRoute[];
  }> = this.select(
    this.openSidebar$,
    this.pageTitle$,
    this.routes$,
    (openSidebar, pageTitle, routes) => ({
      openSidebar,
      pageTitle: `ComponentStoreToolkit ${pageTitle?.toUpperCase() || ''}`,
      routes,
    })
  );

  constructor(private readonly router: Router) {
    super(initialState);
  }

  readonly setPageTitle = this.updater<string | null>((state, pageTitle) => ({
    ...state,
    pageTitle,
  }));

  readonly setOpenSidebar = this.updater<boolean>((state, openSidebar) => ({
    ...state,
    openSidebar,
  }));

  readonly toggleSidebar = this.effect<void>(source$ =>
    source$.pipe(
      withLatestFrom(this.openSidebar$),
      map(([, openSidebar]) => !openSidebar),
      tap<boolean>(openSidebar => this.setOpenSidebar(openSidebar))
    )
  );

  readonly setCurrentUrl = this.effect<string>(source$ =>
    source$.pipe(
      withLatestFrom(this.routes$),
      map(([currentUrl, routes]) =>
        routes.find(route => route.url === currentUrl)
      ),
      filter((currentRoute): currentRoute is SidebarRoute => !!currentRoute),
      tap(route => {
        this.patchState({ currentUrl: route.url, pageTitle: route.label });
      })
    )
  );
}
