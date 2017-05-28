import { State } from './State';
import { Language } from './Language';

export interface Props extends State {
    pageContext: PageJS.Context;
    onSelectedLanguage: { (language: Language): void };
};