import { FieldModel } from '../FieldModel';

export interface TextFieldModel extends FieldModel {
    placeholder?: string;
    isTranslatable?: boolean;
}