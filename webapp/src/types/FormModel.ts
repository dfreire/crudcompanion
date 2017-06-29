import { BlockModel } from './BlockModel';
import { FieldModel } from './FieldModel';

export interface FormModel extends BlockModel {
    title?: string;
    span: number;
    fields: FieldModel[];
    getHandler?: string;
    saveHandler: string;
    removeHandler?: string;

    record?: object;
}