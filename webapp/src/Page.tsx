import * as React from 'react';
import axios from 'axios';
import { Row, Col } from 'antd';
import { PageModel } from './Model';

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
            <div>
                <Row>
                    <Col span={12}>{JSON.stringify(this.state.model)}</Col>
                </Row>
            </div>
        );
    }

    componentDidMount() {
        this._updateModel();
    }

    componentDidUpdate() {
        this._updateModel();
    }

    _updateModel() {
        const path = this.props.pageContext.path === '/' ? '/index' : this.props.pageContext.path;

        axios.get(`${path}.json`)
            .then((response) => {
                this.setState({ model: response.data as PageModel });
            })
            .catch((error) => {
                this.setState({ model: undefined });
            });
    }
}

export default Page;
