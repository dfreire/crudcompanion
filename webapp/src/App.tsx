import * as React from 'react';
import * as page from 'page';
import Page from './Page';
import { Link } from './Link';

interface Props {

}

interface State {
    pageContext?: PageJS.Context
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        console.log('componentWillMount');

        page('*', (pageContext: PageJS.Context) => {
            console.log('pageContext', pageContext);
            this.setState({ pageContext });
        });

        page.start({ hashbang: false });
    }

    render() {
        return (
            <div>
                <Link path="/a" text="a" /> | <Link path="/b" text="b" /> | <Link path="/c" text="c" />
                {this._render()}
            </div>
        );
    }

    _render() {
        if (this.state.pageContext != null) {
            return <Page pageContext={this.state.pageContext} />;
        } else {
            return <div />;
        }
    }
}

export default App;
