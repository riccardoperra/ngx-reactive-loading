import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EXAMPLE_ROUTES } from './constants/routes';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: 'loading-store', pathMatch: 'full' },
      ...EXAMPLE_ROUTES,
    ]),
  ],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
