import { InjectionToken } from '@angular/core';
import { createControlledLoadingRegistry } from '../core/create-loading-registry';
import { ControlledLoadingRegistry } from '../model';

export const HTTP_LOADING_REGISTRY =
  new InjectionToken<ControlledLoadingRegistry>(
    '[ngx-reactive-loading] HttpLoadingRegistry',
    {
      providedIn: 'root',
      factory: createControlledLoadingRegistry,
    }
  );
