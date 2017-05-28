import * as _ from 'underscore';
import * as React from 'react';
import * as page from 'page';
import * as queryString from 'query-string';
import * as Util from './Util';
import * as Ajax from './Ajax';
import { State } from './types/State';
import { Props } from './types/Props';
import { Language } from './types/Language';
import { PageModel } from './types/PageModel';
import { TableModel } from './types/TableModel';
import { Page } from './page/Page';

class App extends React.Component<{}, State> {
    private handlers: any;

    constructor(props: {}) {
        super(props);
        this.state = {
            languages: [],
            language: '',
            pageModel: { blocks: [] },
            shouldFetch: false,
        };

        this.handlers = {
            onSelectedLanguage: (language: Language) => {
                const { pageContext } = this.state;
                if (pageContext != null) {
                    const query = { ...queryString.parse(pageContext.querystring), language_id: language };
                    page(Util.cleanUrl(`${pageContext.pathname}/?${queryString.stringify(query)}`));
                }
            }
        };

        this._fetch = _.debounce(this._fetch.bind(this), 300);
    }

    render() {
        if (this.state.pageContext != null) {
            const props: Props = { ...this.state, ...this.handlers };
            return <Page {...props} />;
        } else {
            return <div />;
        }
    }

    componentDidMount() {
        Ajax.get('/api/viewmodel/website.json')
            .then((response) => {
                // page(/^(?!\/api)/ as any, (pageContext: PageJS.Context) => {
                page('*', (pageContext: PageJS.Context) => {
                    Ajax.get(Util.cleanUrl(`/api/viewmodel/${pageContext.pathname}/index.json`))
                        .then((pageModel: PageModel) => {
                            const query = queryString.parse(pageContext.querystring);

                            if (query.language_id == null) {
                                query.language_id = this.state.language;
                                page(Util.cleanUrl(`${pageContext.pathname}/?${queryString.stringify(query)}`));

                            } else if (pageModel.redirect != null) {
                                page(Util.cleanUrl(`${pageModel.redirect}/?${pageContext.querystring}`));

                            } else {
                                this.setState({
                                    pageContext,
                                    language: query.language_id,
                                    pageModel,
                                    shouldFetch: true
                                });
                            }
                        });
                });
                page.start({ hashbang: false });

                const languages = response.languages;
                const language = languages[0];
                this.setState({ languages, language });
            });
    }

    componentDidUpdate() {
        if (this.state.shouldFetch) {
            this.setState({ shouldFetch: false });
            this._fetch();
        }
    }

    _fetch() {
        console.log('fetch');
        this.state.pageModel.blocks.forEach((blockModel, i) => {
            const state = { ...this.state };
            state.pageModel.blocks[i].isLoading = true;
            this.setState(state);

            switch (blockModel.type) {
                case 'table':
                    this._fetchTable(blockModel as TableModel, i);
                    break;
                case 'form':
                    break;
                default:
                    break;
            }
        });
    }

    _fetchTable(tableModel: TableModel, i: number) {
        const { getHandler } = tableModel;
        const qs = queryString.stringify({ language_id: this.state.language });
        Ajax.get(Util.cleanUrl(`/api/${getHandler}?${qs}`))
            .then((response) => {
                tableModel.records = response;
                tableModel.isLoading = false;
                const state = { ...this.state };
                state.pageModel.blocks[i] = tableModel;
                this.setState(state);
            });
    }
}

export default App;
