import { State } from './State';
import { Language } from './Language';

export interface Props extends State {
    pageContext: PageJS.Context;

    onSelectLanguage: { (language: Language): void };
    onSelectTableIds: { (blockIdx: number, selectedIds: string[]): void };
    onRemoveTableRecords: { (blockIdx: number, recordIds: string[]): void };
};