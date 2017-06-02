import { State } from './State';
import { Language } from './Language';

export interface Props extends State {
    pageContext: PageJS.Context;

    onPageSelectLanguage: { (language: Language): void };
    onTableSelectIds: { (blockIdx: number, selectedIds: string[]): void };
    onTableRemoveRecords: { (blockIdx: number, recordIds: string[]): void };
    onTableUploadedFile: { (blockIdx: number): void };
    onFormRecordChange: { (blockIdx: number, key: string, value: any): void };
    onFormRecordSave: { (blockIdx: number): void };
    onFormRecordRemove: { (blockIdx: number): void };
    onFormCancel: { (blockIdx: number): void };
};