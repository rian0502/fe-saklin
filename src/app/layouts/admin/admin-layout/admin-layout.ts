import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Breadcrumb } from '../../../shared/components/breadcrumb/breadcrumb';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { Topbar } from '../../../shared/components/topbar/topbar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, MatSidenavModule, Sidebar, Topbar, Breadcrumb],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  readonly sidenavOpened = signal(true);

  toggleSidenav(): void {
    this.sidenavOpened.update((opened) => !opened);
  }
}
