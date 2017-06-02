import { BlockModel } from './BlockModel';
import { ColumnModel } from './ColumnModel';

export interface TableModel extends BlockModel {
    title?: string;
    span: number;
    cols: ColumnModel[];
    getHandler: string;
    removeHandler: string;
    uploadHandler?: string;
    createPage?: string;
    updatePage: string;
    bulkUpdate?: boolean;

    records?: any[];
    selectedIds: string[];
}