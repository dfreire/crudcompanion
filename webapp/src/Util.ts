import * as _ from 'underscore';
import { Language } from './types/Language';
import { Captions } from './types/Captions';
import { TranslationMap } from './types/TranslationMap';

export function cleanUrl(url: string): string {
    return url.replace(/\/\/+/g, '\/');
}

export function reduceTranslation(_translations: TranslationMap, languages: Language[], languageId: string): object {
    const languageById = _.indexBy(languages, 'id');
    const languageIds = [];
    
    let id = languageId;
    while (id != null && languageById[id] != null) {
        languageIds.push(id);
        const language = languageById[id];
        delete languageById[id];
        id = language.fallbackId;
    }

    languageIds.push(..._.keys(languageById));
    const translations = languageIds.map(_languageId => _translations[languageId]);
    return Object.assign({}, ...translations);
}

export function getCaption(p: { captions: Captions, languageId: string }, key: string, valueMap?: object): string {
    const compiled = _.template(p.captions[key][p.languageId]);
    return compiled(valueMap);
}