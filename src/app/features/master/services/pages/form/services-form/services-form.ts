import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-services-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PageHeader,
  ],
  templateUrl: './services-form.html',
  styleUrl: './services-form.scss',
})
export class ServicesForm {
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    durationMinutes: [0, [Validators.required, Validators.min(0)]],
  });

  onSubmit(): void {
    // Reserved for create/update API call — no business logic yet.
  }
}
