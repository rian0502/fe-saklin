import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../../features/auth/services/auth';
import { NavItem } from '../../types/nav-item.model';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
  { label: 'Outlets', icon: 'storefront', path: '/admin/outlets', requiredPermission: 'outlets.view' },
  { label: 'Customers', icon: 'group', path: '/admin/customers', requiredPermission: 'customers.view' },
  {
    label: 'Machine Types',
    icon: 'category',
    path: '/admin/machine-types',
    requiredPermission: 'machine-types.view',
  },
  { label: 'Machines', icon: 'settings_suggest', path: '/admin/machines', requiredPermission: 'machines.view' },
  {
    label: 'Services',
    icon: 'local_laundry_service',
    path: '/admin/services',
    requiredPermission: 'services.view',
  },
  {
    label: 'Inventory Items',
    icon: 'inventory_2',
    path: '/admin/inventory-items',
    requiredPermission: 'inventory-items.view',
  },
  { label: 'Promotions', icon: 'sell', path: '/admin/promotions', requiredPermission: 'promotions.view' },
  { label: 'Users', icon: 'manage_accounts', path: '/admin/users', requiredPermission: 'users.view' },
  { label: 'Orders', icon: 'receipt_long', path: '/admin/orders', requiredPermission: 'orders.view' },
  { label: 'Reports', icon: 'insights', path: '/admin/reports', requiredPermission: 'reports.view' },
  { label: 'Settings', icon: 'settings', path: '/admin/settings', requiredPermission: 'settings.view' },
];

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly authService = inject(AuthService);

  readonly visibleNavItems = computed(() => NAV_ITEMS.filter((item) => this.isVisible(item)));

  private isVisible(item: NavItem): boolean {
    if (item.requiredRole && !this.authService.hasRole(item.requiredRole)) {
      return false;
    }

    if (item.requiredPermission && !this.authService.hasPermission(item.requiredPermission)) {
      return false;
    }

    return true;
  }
}
