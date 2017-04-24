export type Language = string;

export interface PageModel {
    redirect?: string;
    blocks?: BlockModel[];
}

export interface BlockModel {
    type: 'table' | 'form';
    span: number;
}

export interface TableModel extends BlockModel {
    title?: string;
    span: number;

    cols: {
        type: 'text' | 'number'
        key: string;
        title: string;
        isTranslatable?: boolean;
    }[];

    sortKeys: string[];

    getHandler: string;
    deleteHandler: string;
    bulkDelete?: boolean;

    createPage: string;

    updatePage: string;
    bulkUpdate?: boolean;
}

export interface FormModel extends BlockModel {
    title?: string;
    span: number;
    fields: FieldModel[];
    getHandler: string;
    saveHandler: string;
    cancelPage: string;
}

export interface FieldModel {
    type: 'text' | 'textarea';
    key: string;
    title: string;
}

export interface TextFieldModel extends FieldModel {
    placeholder?: string;
    isTranslatable?: boolean;
}

export interface TextAreaFieldModel extends FieldModel {
    placeholder?: string;
    isTranslatable?: boolean;
    rows?: number;
}

export interface DateFieldModel extends FieldModel {

}