import { FieldModel } from './FieldModel';

export interface SelectOneFieldModel extends FieldModel {
    placeholder?: string;
    getHandler: string;
    searchHandler: string;
    captionKey: string;
    valueKey: string;
}