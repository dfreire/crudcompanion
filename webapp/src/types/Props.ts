import { State } from './State';
import { Language } from './Language';
import { TableModel } from '../types/TableModel';
import { FormModel } from '../types/FormModel';
import { FieldModel } from '../types/FieldModel';

export interface Props extends State {
    pageContext: PageJS.Context;

    onPageSelectLanguage: { (language: Language): void };

    onTableSelectIds: { (blockIdx: number, tableModel: TableModel, selectedIds: string[]): void };
    onTableRemoveRecords: { (blockIdx: number, tableModel: TableModel, recordIds: string[]): void };
    onTableUploadedFile: { (blockIdx: number, tableModel: TableModel): void };
    
    onFormRecordChange: { (blockIdx: number, formModel: FormModel, fieldModel: FieldModel, value: any): void };
    onFormRecordSave: { (blockIdx: number, formModel: FormModel): void };
    onFormRecordRemove: { (blockIdx: number, formModel: FormModel): void };
    onFormCancel: { (blockIdx: number, formModel: FormModel): void };
};