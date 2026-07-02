import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FilterField } from '../../types/filter-field.model';

@Component({
  selector: 'app-filter-panel',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './filter-panel.html',
  styleUrl: './filter-panel.scss',
})
export class FilterPanel {
  private readonly formBuilder = inject(FormBuilder);

  readonly fields = input.required<FilterField[]>();
  readonly filtersChange = output<Record<string, string>>();

  readonly form = this.formBuilder.group({});

  constructor() {
    effect(() => {
      for (const field of this.fields()) {
        if (!this.form.contains(field.key)) {
          this.form.addControl(field.key, this.formBuilder.control(''));
        }
      }
    });
  }

  apply(): void {
    this.filtersChange.emit(this.currentValue());
  }

  reset(): void {
    this.form.reset();
    this.apply();
  }

  private currentValue(): Record<string, string> {
    // Controls are added dynamically per `fields()`, so the FormGroup's
    // static type can't reflect its shape — this cast is the one place
    // that boundary is bridged.
    return this.form.getRawValue() as Record<string, string>;
  }
}
