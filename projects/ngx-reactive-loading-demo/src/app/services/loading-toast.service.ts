import { Injectable } from '@angular/core';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { LoadingService } from 'ngx-reactive-loading';
import { skip } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingToastService<T extends PropertyKey> {
  constructor(private readonly toastService: HotToastService) {}

  observeLoadingStatus(loadingStore: LoadingService<T>): void {
    const toast: Map<PropertyKey, CreateHotToastRef<unknown>> = new Map<
      PropertyKey,
      CreateHotToastRef<unknown>
    >();

    let loadingRef: CreateHotToastRef<unknown>;

    loadingStore
      .someLoading()
      .pipe(skip(1))
      .subscribe(evt => {
        if (loadingRef) {
          loadingRef.close();
        }
        if (evt) {
          loadingRef = this.toastService.loading('LOADING');
        } else {
          loadingRef = this.toastService.success('COMPLETED');
        }
      });

    loadingStore.events$.subscribe(evt => {
      const ref = toast.get(evt.type);
      if (ref) {
        ref.close();
      }
      if (evt.loading) {
        const ref = this.toastService.loading(String(evt.type));
        toast.set(evt.type, ref);
      } else {
        const ref = this.toastService.success(String(evt.type));
        toast.set(evt.type, ref);
      }
    });
  }
}
