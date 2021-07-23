import { InjectionToken } from '@angular/core';

export const SOME_LOADING = new InjectionToken<boolean>(
  '[ngx-reactive-loading] loadingService/someLoading'
);

export const IS_LOADING = new InjectionToken<boolean>(
  '[ngx-reactive-loading] loadingService/isLoading'
);
