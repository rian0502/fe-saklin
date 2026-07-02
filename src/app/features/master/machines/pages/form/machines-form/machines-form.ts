import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-machines-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PageHeader,
  ],
  templateUrl: './machines-form.html',
  styleUrl: './machines-form.scss',
})
export class MachinesForm {
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    code: ['', Validators.required],
    machineTypeId: [0, Validators.required],
    outletId: [0, Validators.required],
    status: ['active', Validators.required],
  });

  onSubmit(): void {
    // Reserved for create/update API call — no business logic yet.
  }
}
