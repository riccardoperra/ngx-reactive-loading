import { NgModule } from '@angular/core';
import { AppComponent } from './app.component.ts';
import { HelloComponent } from './hello.component.ts';
import { ReactiveLoadingModule } from 'ngx-reactive-loading';

@NgModule({
  declarations: [AppComponent, HelloComponent],
  imports: [ReactiveLoadingModule.forRoot(['prop1'])],
})
export class AppModule {}
