import * as React from 'react';
import * as page from 'page';
import * as queryString from 'querystring';
import { get } from './Ajax';
import { Page } from './page/Page';
import * as Types from './types/types';
import * as Ajax from './Ajax';

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

    componentWillMount() {
        page('*', (pageContext: PageJS.Context) => {
            Ajax.get(`/api/contentmodel/${pageContext.pathname}/index.json`)
                .then((response) => {
                    const model = response as Types.PageModel;
                    if (model.redirect != null) {
                        page(model.redirect);
                    } else {
                        this.setState({ pageContext, model });
                    }
                });
        });

        page.start({ hashbang: false });
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
                this.setState({ language });
            }
        }

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
        get("/api/contentmodel/website.json")
            .then((response) => {
                let query;
                if (this.state.pageContext != null) {
                    query = queryString.parse(this.state.pageContext.querystring);
                }
                const languages = response.languages;
                const language = query.lang || languages[0];
                this.setState({ languages, language });
            });
    }

    componentDidUpdate() {
        if (this.state.pageContext != null) {
            const query = queryString.parse(this.state.pageContext.querystring);
            if (query.lang != this.state.language) {
                query.lang = this.state.language;
                const url = `${this.state.pageContext.pathname}/?${queryString.stringify(query)}`;
                const cleanUrl = url.replace(/\/\/+/g, '\/');
                page(cleanUrl);
            }
        }
    }
}

export default App;
