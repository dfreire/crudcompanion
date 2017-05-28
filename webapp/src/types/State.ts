import { Language } from './Language';
import { PageModel } from './PageModel';
import { BlockModel } from './BlockModel';

export interface State {
    pageContext?: PageJS.Context;
    languages?: Language[];
    language?: Language;
    pageModel?: PageModel;
    blocks?: {
        model: BlockModel;
        data: any;
    }[];
}
