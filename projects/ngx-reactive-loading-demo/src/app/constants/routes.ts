import { Route } from '@angular/router';
import { SidebarRoute } from '../store/ui-store';

export type LabeledRoute = Route & SidebarRoute;

export const ROUTES: LabeledRoute[] = [
  {
    path: 'loading-store',
    label: 'Basic example',
    url: '/loading-store',
    loadChildren: () =>
      import(
        '../pages/01-loading-store-example/loading-store-example.module'
      ).then(m => m.LoadingStoreExampleModule),
  },
  {
    path: 'loading-store-with-service',
    label: 'Example with service',
    url: '/loading-store-with-service',
    loadChildren: () =>
      import(
        '../pages/02-loading-store-service-example/loading-store-service-example.module'
      ).then(m => m.LoadingStoreServiceExampleModule),
  },
  {
    path: 'loading-store-with-ngrx',
    label: 'Example with ngrx',
    url: '/loading-store-with-ngrx',
    loadChildren: () =>
      import(
        '../pages/03-loading-store-ngrx-example/loading-store-ngrx-example.module'
      ).then(m => m.LoadingStoreNgrxExampleModule),
  },
];
