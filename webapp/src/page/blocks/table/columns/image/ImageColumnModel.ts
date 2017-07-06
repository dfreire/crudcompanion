import { ColumnModel } from '../ColumnModel';

export interface ImageColumnModel extends ColumnModel {
    popoverPlacement: 'top' | 'left' | 'right' | 'bottom'
    | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
    | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
    popoverKey: string;
    clickKey: string;
}