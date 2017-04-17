import * as React from 'react';
import * as page from 'page';
import { get } from './Ajax';
import Page from './page/Page';

export type Language = string;

interface Props {

}

interface State {
    pageContext?: PageJS.Context;
    languages?: Language[];
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        page('*', (pageContext: PageJS.Context) => {
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
        get("/api/contentmodel/languages.json")
            .then((languages) => {
                this.setState({ languages });
            });
    }
}

export default App;
