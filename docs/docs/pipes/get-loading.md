---
sidebar_position: 1
---

# getLoading

Returns a boolean observable which will emit a new value once the state of the given properties of the store
changes.

## API

```ts
import { Observable } from 'rxjs';
import { LoadingStore, LoadingStoreState } from 'ngx-reactive-loading';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'getLoading' })
export interface GetLoading implements PipeTransform {
  transform<T extends PropertyKey>(
    value: LoadingStore<T[]>,
    properties: T[] | T
  ): Observable<boolean>;

  transform<T extends PropertyKey>(
    value: LoadingRegistry<T>,
    properties: T | T[]
  ): Observable<boolean>;

  transform<T extends PropertyKey>(
    value: LoadingStore<T[]> | LoadingRegistry<T>,
    properties: T | T[]
  ): Observable<boolean>;
}
```

- `value` - The loading store or loading registry
- `properties` - The properties of the given store or registry that will be listened

## Example

```ts
import { Component, OnInit } from '@angular/core';
import { LoadingRegistry } from 'ngx-reactive-loading';

@Component({
  selector: 'app-example',
  template: `
    <ng-container *ngIf="loadingRegistry | getLoading: 'key' | async">
      Key is loading...
    </ng-container>
  `
})

export class ExampleComponent implements OnInit {
  constructor(readonly loadingRegistry: LoadingRegistry) {
  }
}
```
