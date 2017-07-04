import { Language } from './Language';
import { PageModel } from './PageModel';
import { RelationshipFieldModel } from './RelationshipFieldModel';

export interface State {
    pageContext?: PageJS.Context;
    languageIds: Language[];
    languageId: Language;
    translationId?: string;
    pageModel: PageModel;
    shouldFetchBlocks: boolean;
    fetchModal?: {
        blockIdx: number;
        fieldIdx: number;
        selectFieldModel: RelationshipFieldModel;
    }
}
