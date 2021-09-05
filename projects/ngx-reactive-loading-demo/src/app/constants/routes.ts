import { Route } from '@angular/router';
import { SidebarRoute } from '../store/ui-store';

export type LabeledRoute = Route & SidebarRoute;

export const EXAMPLE_ROUTES: LabeledRoute[] = [
  {
    path: 'loading-store',
    label: 'Loading store',
    url: '/loading-store',
    loadChildren: () =>
      import(
        '../pages/01-loading-store-example/loading-store-example.module'
      ).then(m => m.LoadingStoreExampleModule),
  },
  {
    path: 'loading-store-with-service',
    label: 'Loading store service',
    url: '/loading-store-with-service',
    loadChildren: () =>
      import(
        '../pages/02-loading-store-service-example/loading-store-service-example.module'
      ).then(m => m.LoadingStoreServiceExampleModule),
  },
  {
    path: 'loading-store-with-ngrx',
    label: 'Ngrx with Loading store',
    url: '/loading-store-with-ngrx',
    loadChildren: () =>
      import(
        '../pages/03-loading-store-ngrx-example/loading-store-ngrx-example.module'
      ).then(m => m.LoadingStoreNgrxExampleModule),
  },
  {
    path: 'loading-directive',
    label: 'Loading directive',
    url: '/loading-directive',
    loadChildren: () =>
      import(
        '../pages/04-loading-directive-example/loading-directive-example.module'
      ).then(m => m.LoadingDirectiveExampleModule),
  },
  {
    path: 'loading-registry-dynamic-actions',
    label: 'Dynamic actions with loading registry',
    url: '/loading-registry-dynamic-actions',
    loadChildren: () =>
      import(
        '../pages/05-loading-registry-dynamic-actions/loading-registry-dynamic-actions-example.module'
      ).then(m => m.LoadingRegistryDynamicActionsExampleModule),
  },
];
