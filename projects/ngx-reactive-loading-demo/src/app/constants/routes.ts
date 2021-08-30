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
  {
    path: 'loading-registry',
    label: 'Example with loading registry',
    url: '/loading-registry',
    loadChildren: () =>
      import(
        '../pages/04-loading-registry-example/loading-registry-example.module'
      ).then(m => m.LoadingRegistryExampleModule),
  },
  {
    path: 'loading-directive',
    label: 'Example with loading directive',
    url: '/loading-directive',
    loadChildren: () =>
      import(
        '../pages/05-loading-directive-example/loading-directive-example.module'
      ).then(m => m.LoadingDirectiveExampleModule),
  },
];
