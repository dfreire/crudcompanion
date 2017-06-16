import { FieldModel } from './FieldModel';
import { ColumnModel } from './ColumnModel';

export interface RelationshipFieldModel extends FieldModel {
    placeholder?: string;
    cols: ColumnModel[];
    getHandler: string;
    records?: any[];
    selectedIds: string[];
    updatePage: string;
    isLoading: boolean;
    isModalOpen: boolean;
    maxCount?: number;
    captionKey: string;
    tableCaptionKey: string;
}