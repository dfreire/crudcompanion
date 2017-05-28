import { State } from './State';
import { Language } from './Language';
import { PageModel } from './PageModel';
import { BlockModel } from './BlockModel';

export interface Props extends State {
    pageContext: PageJS.Context;
    languages: Language[];
    language: Language;
    pageModel: PageModel;
    blocks?: {
        model: BlockModel;
        data: any;
    }[];

    onSelectedLanguage: { (language: Language): void };
};