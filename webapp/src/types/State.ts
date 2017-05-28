import { Language } from './Language';
import { PageModel } from './PageModel';

export interface State {
    pageContext?: PageJS.Context;
    languages: Language[];
    language: Language;
    pageModel: PageModel;
    shouldFetch: boolean;
}
