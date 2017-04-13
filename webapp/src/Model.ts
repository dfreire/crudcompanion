export interface PageModel {
    fields: FieldModel[];
}

export interface FieldModel {
    type: 'text' | 'table';
    title: string;
    span: number;
}

export interface TableFieldModel extends FieldModel {
    type: 'table',
    cols: {
        type: 'text' | 'number'
        name: string;
        title: string;
    }[]
    sortOrder: string[];
    updateSortOrderKey?: string;

    fetchHandler: string;

    addRowPage: string;

    editRowPage: string;
    bulkEdit?: boolean;

    removeRowHandler: string;
    bulkRemove?: boolean;
}
