import {
  Component,
  EventEmitter,
  Inject,
  Optional,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoadingService } from 'ngx-reactive-loading';

@Component({
  selector: 'app-form-todo',
  templateUrl: 'form-todo.component.html',
})
export class FormTodoComponent {
  readonly todoTitle = new FormControl('', Validators.required);
  @Output() readonly submitEvent = new EventEmitter<string>();

  constructor(
    @Optional()
    @Inject(LoadingService)
    public readonly loadingStore: LoadingService
  ) {}

  submit(): void {
    if (this.todoTitle.valid) {
      this.submitEvent.emit(this.todoTitle.value);
      this.todoTitle.reset();
    }
  }
}
