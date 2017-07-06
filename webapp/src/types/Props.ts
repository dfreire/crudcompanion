import { State } from './State';

export interface Props extends State {
    pageContext: PageJS.Context;

    onChangePageLanguage: { (languageId: string): void };

    onTableSelectIds: { (blockIdx: number, selectedIds: string[]): void };
    onTableRemoveRecords: { (blockIdx: number, recordIds: string[]): void };
    onTableUploadedFile: { (blockIdx: number): void };
    
    onFormChangeRecord: { (blockIdx: number, fieldIdx: number, value: any): void };
    onFormSaveRecord: { (blockIdx: number): void };
    onFormRemoveRecord: { (blockIdx: number): void };
    onFormCancel: { (blockIdx: number): void };

    onRelationshipModalOpen: { (blockIdx: number, fieldIdx: number): void };
    onRelationshipModalClose: { (blockIdx: number, fieldIdx: number): void };
    onRelationshipModalTableSelectIds: { (blockIdx: number, fieldIdx: number, selectedIds: string[]): void };

    onTranslationModalOpen: { (blockIdx: number, fieldIdx: number): void };
    onTranslationModalClose: { (blockIdx: number, fieldIdx: number): void };
    onTranslationModalSave: { (blockIdx: number, fieldIdx: number): void };

    onChangeTranslationLanguage: { (blockIdx: number, translationId: string): void };
};