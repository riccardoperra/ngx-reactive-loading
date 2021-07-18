import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './constants/routes';

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
