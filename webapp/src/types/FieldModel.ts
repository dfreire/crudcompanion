export interface FieldModel {
    type: 'text' | 'textarea' | 'relationship' | 'thumbnail';
    key: string;
    title: string;
}