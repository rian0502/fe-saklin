import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

const DEFAULT_CONFIG: MatSnackBarConfig = {
  duration: 4000,
  horizontalPosition: 'end',
  verticalPosition: 'top',
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.show(message, 'notification--success');
  }

  error(message: string): void {
    this.show(message, 'notification--error');
  }

  info(message: string): void {
    this.show(message, 'notification--info');
  }

  private show(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Dismiss', { ...DEFAULT_CONFIG, panelClass });
  }
}
