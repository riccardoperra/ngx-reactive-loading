import { HttpContext, HttpContextToken } from '@angular/common/http';

export const LOADING_DEFAULT_CONTEXT =
  '[ngx-reactive-loading/loading-store-interceptor/default]';

export const HTTP_LOADING_CONTEXT = new HttpContextToken<PropertyKey>(
  () => LOADING_DEFAULT_CONTEXT
);

export const withHttpLoadingContext = (key: PropertyKey) =>
  new HttpContext().set(HTTP_LOADING_CONTEXT, key);
