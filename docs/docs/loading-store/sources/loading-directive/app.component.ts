import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingService } from 'ngx-reactive-loading';

@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoadingService.componentProvider(['add'])],
})
class AppComponent {
  constructor(private readonly loadingService: LoadingService) {}
}
