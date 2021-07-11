import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadingStoreExampleComponent } from './pages/loading-store-example/loading-store-example.component';
import { LoadingStoreWithServiceExampleComponent } from './pages/loading-store-with-service-example/loading-store-with-service-example.component';

const routes: Routes = [
  { path: 'loading-store', component: LoadingStoreExampleComponent },
  {
    path: 'loading-store-with-service',
    component: LoadingStoreWithServiceExampleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
