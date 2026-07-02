import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-users-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PageHeader,
  ],
  templateUrl: './users-form.html',
  styleUrl: './users-form.scss',
})
export class UsersForm {
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    status: ['active', Validators.required],
  });

  onSubmit(): void {
    // Reserved for create/update API call — no business logic yet.
  }
}
