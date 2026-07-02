export interface NavItem {
    label: string;
    icon: string;
    path: string;
    requiredRole?: string;
    requiredPermission?: string;
}
