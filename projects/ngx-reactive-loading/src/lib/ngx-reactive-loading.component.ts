import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'async',
  template: `
    <ng-container *ngIf="observable">
      <ng-container *ngIf="observable | withState | async; let state">
        <ng-container *ngIf="loadingTpl && state.loading" [ngTemplateOutlet]="loadingTpl">
        </ng-container>
        <ng-container
          *ngIf="valueTpl && state.value"
          [ngTemplateOutlet]="valueTpl"
          [ngTemplateOutletContext]="{ $implicit: state.value }"
        >
        </ng-container>
        <ng-container *ngIf="errorTpl && state.error" [ngTemplateOutlet]="errorTpl"> </ng-container>
      </ng-container>
    </ng-container>
  `,
  styles: [],
})
export class NgxReactiveLoadingComponent<T> implements OnInit {
  @ContentChild('loading') loadingTpl?: TemplateRef<unknown>;
  @ContentChild('value') valueTpl?: TemplateRef<unknown>;
  @ContentChild('error') errorTpl?: TemplateRef<unknown>;
  @Input() observable?: Observable<T>;

  constructor() {}

  ngOnInit(): void {}
}
