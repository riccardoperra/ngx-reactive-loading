import {
  Directive,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Subject,
  map,
  switchMap,
  takeUntil,
} from 'rxjs';
import { LoadingService } from '../services';
import { LOADING_STORE } from '../internal/tokens';

@Directive({
  selector: '[ngxLoading]',
})
export class LoadingDirective implements OnDestroy, OnInit {
  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly loadingKeys$ = new BehaviorSubject<string | string[]>([]);
  private readonly loadingElseTemplate$ =
    new BehaviorSubject<TemplateRef<unknown> | null>(null);

  @Input() set ngxLoading(_: string | string[]) {
    this.loadingKeys$.next(_);
  }

  @Input() set ngxLoadingElse(_: TemplateRef<unknown>) {
    this.loadingElseTemplate$.next(_);
  }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.templateRef);

    combineLatest([this.loadingKeys$, this.loadingElseTemplate$])
      .pipe(
        takeUntil(this.destroy$),
        switchMap(([keys, template]) =>
          this.loadingService
            .someLoading(Array.isArray(keys) ? keys : [keys])
            .pipe(map(isLoading => ({ isLoading, template })))
        )
      )
      .subscribe(({ isLoading, template }) =>
        this.updateView(isLoading, template)
      );
  }

  constructor(
    @Inject(LOADING_STORE)
    private readonly loadingService: LoadingService,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<unknown>
  ) {
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(
    isLoading: boolean,
    elseTemplateRef?: TemplateRef<unknown> | null
  ) {
    this.viewContainerRef.clear();
    if (!isLoading) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      return;
    }
    if (isLoading && elseTemplateRef) {
      this.viewContainerRef.createEmbeddedView(elseTemplateRef);
    }
  }
}
