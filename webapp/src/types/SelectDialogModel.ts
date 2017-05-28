import { ColumnModel } from './ColumnModel';

export interface SelectDialogModel {
    title: string;
    cols: ColumnModel[];
    getHandler: string;
    maxSelectCount: number;
}
