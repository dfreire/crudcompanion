import { State } from './State';
import { Language } from './Language';

export interface Props extends State {
    pageContext: PageJS.Context;

    onPageSelectLanguage: { (language: Language): void };

    onTableSelectIds: { (blockIdx: number, selectedIds: string[]): void };
    onTableRemoveRecords: { (blockIdx: number, recordIds: string[]): void };
    onTableUploadedFile: { (blockIdx: number): void };
    
    onFormChangeRecord: { (blockIdx: number, fieldIdx: number, value: any): void };
    onFormSaveRecord: { (blockIdx: number): void };
    onFormRemoveRecord: { (blockIdx: number): void };
    onFormCancel: { (blockIdx: number): void };

    onModalOpen: { (blockIdx: number, fieldIdx: number): void };
    onModalClose: { (blockIdx: number, fieldIdx: number): void };
};