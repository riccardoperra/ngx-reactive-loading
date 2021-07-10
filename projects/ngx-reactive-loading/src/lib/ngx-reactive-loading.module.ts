import { NgModule } from '@angular/core';
import { NgxReactiveLoadingComponent } from './ngx-reactive-loading.component';
import { WithStatePipe } from './pipes/with-state.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NgxReactiveLoadingComponent, WithStatePipe],
  imports: [CommonModule],
  exports: [NgxReactiveLoadingComponent, WithStatePipe],
})
export class NgxReactiveLoadingModule {}
