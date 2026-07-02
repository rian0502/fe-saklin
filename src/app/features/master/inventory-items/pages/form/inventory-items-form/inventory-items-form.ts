import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-inventory-items-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PageHeader,
  ],
  templateUrl: './inventory-items-form.html',
  styleUrl: './inventory-items-form.scss',
})
export class InventoryItemsForm {
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    unit: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  onSubmit(): void {
    // Reserved for create/update API call — no business logic yet.
  }
}
