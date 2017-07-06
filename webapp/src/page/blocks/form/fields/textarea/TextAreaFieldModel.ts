import { FieldModel } from '../FieldModel';

export interface TextAreaFieldModel extends FieldModel {
    placeholder?: string;
    isTranslatable?: boolean;
    rows?: number;
}