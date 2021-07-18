import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TrackByFunction,
} from '@angular/core';
import { UIStore } from '../../../store/ui-store';

type Route = { label: string; url: string };

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() appTitle: string = '';
  readonly title$ = this.uiStore.pageTitle$;

  constructor(private readonly uiStore: UIStore) {}

  toggleSidebar(): void {
    this.uiStore.toggleSidebar();
  }
}
