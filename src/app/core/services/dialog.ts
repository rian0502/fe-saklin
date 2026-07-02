import { Injectable, inject } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { ConfirmDialog, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog';
import { DeleteDialog, DeleteDialogData } from '../../shared/components/delete-dialog/delete-dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(MatDialog);

  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.openConfirmation(ConfirmDialog, data, '360px');
  }

  confirmDelete(data: DeleteDialogData): Observable<boolean> {
    return this.openConfirmation(DeleteDialog, data, '400px');
  }

  open<TComponent, TData = unknown, TResult = unknown>(
    component: ComponentType<TComponent>,
    config?: MatDialogConfig<TData>,
  ): MatDialogRef<TComponent, TResult> {
    return this.dialog.open<TComponent, TData, TResult>(component, config);
  }

  private openConfirmation<TComponent, TData>(
    component: ComponentType<TComponent>,
    data: TData,
    width: string,
  ): Observable<boolean> {
    return this.dialog
      .open<TComponent, TData, boolean>(component, { width, data })
      .afterClosed()
      .pipe(map((result) => result ?? false));
  }
}
