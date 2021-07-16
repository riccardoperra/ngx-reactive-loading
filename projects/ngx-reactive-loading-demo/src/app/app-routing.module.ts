import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingStoreWithServiceExampleComponent } from './pages/loading-store-with-service-example/loading-store-with-service-example.component';

const routes: Routes = [
  {
    path: 'loading-store',
    loadChildren: () =>
      import('./pages/loading-store-example/loading-store-example.module').then(
        m => m.LoadingStoreExampleModule
      ),
  },
  {
    path: 'loading-store-with-service',
    loadChildren: () =>
      import(
        './pages/loading-store-with-service-example/loading-store-example-with-service.module'
      ).then(m => m.LoadingStoreExampleWithServiceModule),
    component: LoadingStoreWithServiceExampleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
