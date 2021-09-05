import { Observable } from 'rxjs';

export interface CustomActionOptions {
  delay: number;
}

export interface CustomAction<T> {
  key: PropertyKey;
  label: string;
  call: () => Observable<T>;
  options: CustomActionOptions;
}
