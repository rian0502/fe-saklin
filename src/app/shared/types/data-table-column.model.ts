export interface DataTableColumn<T> {
    key: string;
    label: string;
    sortable?: boolean;
    cell: (row: T) => string;
}
