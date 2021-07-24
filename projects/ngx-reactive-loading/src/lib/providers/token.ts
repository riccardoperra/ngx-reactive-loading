import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const SOME_LOADING = new InjectionToken<Observable<boolean>>(
  '[ngx-reactive-loading] loadingService/someLoading'
);
