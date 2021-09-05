import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TodoStateService } from '../../../02-loading-store-service-example/todo.service';
import { TodoCustomAction } from '../../models/todo-state-action';

@Component({
  selector: 'app-add-action-form',
  templateUrl: './add-action-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddActionFormComponent {
  readonly form = this.fb.group({
    label: this.fb.control('', control => Validators.required(control)),
    key: this.fb.control('', control => Validators.required(control)),
  });

  @Output() readonly submitEvent = new EventEmitter<TodoCustomAction>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly todoService: TodoStateService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const value = this.form.value as { label: string; key: string };

      const action: TodoCustomAction = {
        label: value.label,
        key: value.key,
        call: () => this.todoService.reloadTodos(),
        options: { delay: 1000 },
      };

      this.submitEvent.emit(action);

      this.form.reset();
    }
  }
}
