export type FilterFieldType = 'text' | 'select' | 'date';

export interface FilterFieldOption {
    label: string;
    value: string;
}

export interface FilterField {
    key: string;
    label: string;
    type: FilterFieldType;
    options?: FilterFieldOption[];
}
