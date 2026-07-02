import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { NavItem } from '../../../../shared/types/nav-item.model';
import { AuthService } from '../../../auth/services/auth';

const QUICK_MENU_ITEMS: NavItem[] = [
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
];

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatCardModule, MatIconModule, PageHeader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly roles = this.authService.roles;

  readonly quickMenuItems = computed(() =>
    QUICK_MENU_ITEMS.filter(
      (item) => !item.requiredPermission || this.authService.hasPermission(item.requiredPermission),
    ),
  );
}
