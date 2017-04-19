import * as _ from 'underscore';

export function getCurrentLanguage(pageContext: PageJS.Context) {
    return pageContext.split('/')[1];
}

export function template(templateStr: string, pageContext: PageJS.Context) {
    const pageData = {
        language: getCurrentLanguage(pageContext)
    }
    return _.template(templateStr)(pageData);
}