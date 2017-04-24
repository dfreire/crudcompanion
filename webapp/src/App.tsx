import * as React from 'react';
import * as page from 'page';
import * as queryString from 'query-string';
import * as Util from './Util';
import * as Types from './types/types';
import * as Ajax from './Ajax';
import { Page } from './page/Page';

interface Props {

}

interface State {
    pageContext?: PageJS.Context;
    languages?: Types.Language[];
    language?: Types.Language;
    model?: Types.PageModel;
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                {this._renderPage()}
            </div>
        );
    }

    _renderPage() {
        const handlers = {
            onSelectedLanguage: (language: Types.Language) => {
                const { pageContext } = this.state;
                if (pageContext != null) {
                    const query = queryString.parse(pageContext.querystring);
                    query.lang = language;
                    page(Util.cleanUrl(`${pageContext.pathname}/?${queryString.stringify(query)}`));
                }
            }
        };

        if (this.state.pageContext != null
            && this.state.languages != null
            && this.state.language != null
            && this.state.model != null) {
            return (
                <Page
                    pageContext={this.state.pageContext}
                    languages={this.state.languages}
                    language={this.state.language}
                    model={this.state.model}
                    {...handlers}
                />
            );
        } else {
            return <div />;
        }
    }

    componentDidMount() {
        console.log('[App] componentDidMount');
        Ajax.get('/api/contentmodel/website.json')
            .then((response) => {
                page('*', (pageContext: PageJS.Context) => {
                    Ajax.get(Util.cleanUrl(`/api/contentmodel/${pageContext.pathname}/index.json`))
                        .then((model: Types.PageModel) => {
                            const query = queryString.parse(pageContext.querystring);

                            if (query.lang == null) {
                                query.lang = this.state.language;
                                page(Util.cleanUrl(`${pageContext.pathname}/?${queryString.stringify(query)}`));

                            } else if (model.redirect != null) {
                                page(Util.cleanUrl(`${model.redirect}/?${pageContext.querystring}`));

                            } else {
                                this.setState({ pageContext, language: query.lang, model });
                            }
                        });
                });
                page.start({ hashbang: false });

                const languages = response.languages;
                const language = languages[0];
                this.setState({ languages, language });
            });
    }
}

export default App;
