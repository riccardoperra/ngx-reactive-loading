import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './constants/routes';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: 'loading-store', pathMatch: 'full' },
      ...ROUTES,
    ]),
  ],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
