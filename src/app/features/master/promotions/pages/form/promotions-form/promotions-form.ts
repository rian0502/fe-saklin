import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-promotions-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PageHeader,
  ],
  templateUrl: './promotions-form.html',
  styleUrl: './promotions-form.scss',
})
export class PromotionsForm {
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    discountPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  onSubmit(): void {
    // Reserved for create/update API call — no business logic yet.
  }
}
