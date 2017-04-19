import * as React from 'react';
import * as page from 'page';
import { get } from './Ajax';
import Page from './page/Page';
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
                        this.setState({ model });
                    }
                });

            this.setState({ pageContext });
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
        const { pageContext, languages } = this.state;

        if (pageContext == null || languages == null) {
            return <div />;

        } else {
            return (
                <Page
                    pageContext={pageContext}
                    languages={languages}
                />
            );
        }
    }

    componentDidMount() {
        get("/api/contentmodel/website.json")
            .then((response) => {
                this.setState({ languages: response.languages });
            });
    }
}

export default App;
