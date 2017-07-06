import { Language } from './Language';
import { Captions } from './Captions';
import { PageModel } from '../page/PageModel';
import { RelationshipFieldModel } from '../page/blocks/form/fields/relationship/RelationshipFieldModel';

export interface State {
    pageContext?: PageJS.Context;

    languages: Language[];
    languageId: string;

    captions: Captions;

    pageModel: PageModel;
    shouldFetchBlocks: boolean;

    fetchModal?: {
        blockIdx: number;
        fieldIdx: number;
        selectFieldModel: RelationshipFieldModel;
    }
}
