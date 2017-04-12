import * as React from 'react';
import { PageModel } from './Model';
import { Button } from 'antd';

interface Props {
    pageContext: PageJS.Context;
}

interface State {
    model?: PageModel;
}

class Page extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="page">
                <h2>Welcome to: {this.props.pageContext.path}</h2>
                <Button type="primary">Button</Button>
            </div>
        );
    }

    componentDidMount() {
        console.log('[Page] componentDidMount');
    }

    componentDidUpdate() {
        console.log('[Page] componentDidUpdate');
    }
}

export default Page;
