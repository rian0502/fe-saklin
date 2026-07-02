import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EMPTY, catchError, finalize, map, switchMap, tap } from 'rxjs';
import { EmptyState } from '../../../../../../shared/components/empty-state/empty-state';
import { Loading } from '../../../../../../shared/components/loading/loading';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';
import { MachineTypeService } from '../../../services/machine-types';

interface LaravelValidationErrorBody {
  errors?: Record<string, string[]>;
}

@Component({
  selector: 'app-machine-types-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    EmptyState,
    Loading,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    PageHeader,
  ],
  templateUrl: './machine-types-form.html',
  styleUrl: './machine-types-form.scss',
})
export class MachineTypesForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly machineTypeService = inject(MachineTypeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  readonly machineTypeId = computed(() => this.paramMap().get('id'));
  readonly isEditMode = computed(() => this.machineTypeId() !== null);

  readonly loading = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly serverErrors = signal<Record<string, string>>({});

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    capacityKg: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        tap(() => this.loadError.set(null)),
        switchMap((id) => this.loadMachineType(id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.destroyRef.onDestroy(() => this.machineTypeService.clearSelectedMachineType());
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.serverErrors.set({});

    const payload = this.form.getRawValue();
    const id = this.machineTypeId();
    const request$ = id
      ? this.machineTypeService.updateMachineType(Number(id), payload)
      : this.machineTypeService.createMachineType(payload);

    request$
      .pipe(
        tap(() => this.router.navigate(['../'], { relativeTo: this.route })),
        catchError((error: unknown) => {
          this.serverErrors.set(this.extractValidationErrors(error));
          return EMPTY;
        }),
        finalize(() => this.submitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private loadMachineType(id: string | null) {
    if (!id) {
      this.form.reset();
      return EMPTY;
    }

    this.loading.set(true);

    return this.machineTypeService.getMachineType(Number(id)).pipe(
      tap((machineType) => this.form.patchValue(machineType)),
      catchError((error: unknown) => {
        this.loadError.set(this.describeLoadError(error));
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  private describeLoadError(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 404) {
      return 'Machine type not found.';
    }

    if (error instanceof HttpErrorResponse && error.status === 0) {
      return 'Network error. Please check your connection and try again.';
    }

    return 'Something went wrong while loading this machine type.';
  }

  private extractValidationErrors(error: unknown): Record<string, string> {
    if (error instanceof HttpErrorResponse && error.status === 422) {
      const body = error.error as LaravelValidationErrorBody | null;

      if (body?.errors) {
        return Object.fromEntries(
          Object.entries(body.errors).map(([field, messages]) => [field, messages[0]]),
        );
      }
    }

    return {};
  }
}
