export interface PageModel {
    fields: FieldModel[];
}

export interface FieldModel {
    type: 'text' | 'table';
    title: string;
    span: number;
}

export interface DateFieldModel extends FieldModel {
}

export interface TableFieldModel extends FieldModel {
    type: 'table',
    cols: {
        type: 'text' | 'number'
        key: string;
        title: string;
    }[]
    sortKeys: string[];
    sortKeyToUpdate?: string;

    fetchHandler: string;

    addRowPage: string;

    editRowPage: string;
    bulkEdit?: boolean;

    removeRowHandler: string;
    bulkRemove?: boolean;
}
