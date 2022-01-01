import { Inject, Injectable } from '@angular/core';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { LoadingEvent, LoadingService } from 'ngx-reactive-loading';
import { finalize, Observable, scan, shareReplay, takeUntil } from 'rxjs';
import { DestroyService } from './destroy.service';

@Injectable()
export class LoadingLogsService<T extends PropertyKey> {
  readonly getLogs = (loadingStore: LoadingService) =>
    loadingStore.events$.pipe(
      scan((acc, value) => acc.concat(value), [] as LoadingEvent[]),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

  constructor(
    @Inject(DestroyService) private readonly destroy$: Observable<void>,
    private readonly toastService: HotToastService
  ) {}

  observeLoadingStatus(loadingStore: LoadingService<T>): void {
    const toast: Map<PropertyKey, CreateHotToastRef<unknown>> = new Map<
      PropertyKey,
      CreateHotToastRef<unknown>
    >();

    let loadingRef: CreateHotToastRef<unknown>;

    const destroyAll = () => {
      toast.forEach(ref => ref.close());
      if (loadingRef) {
        loadingRef.close();
      }
    };

    loadingStore
      .someLoading()
      .pipe(
        finalize(() => destroyAll()),
        takeUntil(this.destroy$)
      )
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

    loadingStore.events$
      .pipe(
        finalize(() => destroyAll()),
        takeUntil(this.destroy$)
      )
      .subscribe(evt => {
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
