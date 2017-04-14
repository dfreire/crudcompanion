import * as React from 'react';
import * as page from 'page';
import Page from './page/Page';

interface Props {

}

interface State {
    pageContext?: PageJS.Context;
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
        if (this.state.pageContext != null) {
            return <Page pageContext={this.state.pageContext} />;
        } else {
            return <div />;
        }
    }
}

export default App;
