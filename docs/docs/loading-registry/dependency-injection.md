---
sidebar_position: 2
title: Dependency Injection
---

# Using with dependency injection

If you need to handle dynamic loading states, the loading registry could be the best choice. Unlike the loading service,
the loading registry currently should be provided only one time in the same node injector. Providing a new token in the
same injector will override all the properties.

First, provide the `LOADING_REGISTRY` token passing the factory function in the module or component.

```ts title=example.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createLoadingRegistry, LOADING_REGISTRY } from 'ngx-reactive-loading';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [{ provide: LOADING_REGISTRY, useFactory: createLoadingRegistry }],
})
export class ExampleModule {}
```

Inside the component, you will have access to the `LOADING_REGISTRY` provider.

```ts title=example.component.ts
import { Component, OnInit } from '@angular/core';
import { LoadingRegistry, LOADING_REGISTRY } from 'ngx-reactive-loading';

@Component({ selector: 'app-example', template: `` })
export class ExampleComponent implements OnInit {
  constructor(
    @Inject(LOADING_REGISTRY)
    readonly loadingRegistry: LoadingRegistry
  ) {
    this.loadingRegistry.addAll(['k1', 'k2']);
  }

  ngOnInit() {}
}
```
