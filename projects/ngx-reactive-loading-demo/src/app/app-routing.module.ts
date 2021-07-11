import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadingStoreExampleComponent } from './pages/loading-store-example.component';

const routes: Routes = [
  { path: 'loading-store', component: LoadingStoreExampleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
