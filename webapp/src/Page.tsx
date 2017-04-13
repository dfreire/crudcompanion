import * as React from 'react';
import axios from 'axios';
import { Row, Col } from 'antd';
import { PageModel, FieldModel } from './Model';

interface Props {
    pageContext: PageJS.Context;
}

interface State {
    model: PageModel;
}

class Page extends React.Component<Props, State> {
    private cache: { [key: string]: PageModel };

    constructor(props: Props) {
        super(props);
        this.state = { model: { fields: [] } };
        this.cache = {};
    }

    render() {
        return (
            <div>
                {this._renderFields()}
            </div>
        );
    }

    _renderFields() {
        return this.state.model.fields.map((field, i) => {
            return this._renderField(field, i);
        });
    }

    _renderField(field: FieldModel, i: number) {
        return (
            <Row key={i}>
                <Col span={field.span}>
                    <h1>{field.title}</h1>
                    <p>{JSON.stringify(field)}</p>
                </Col>
            </Row>
        )
    }

    componentDidMount() {
        this._updateModel();
    }

    componentDidUpdate() {
        this._updateModel();
    }

    _updateModel() {
        const pagePath = this.props.pageContext.path;
        console.log(pagePath);

        if (this.cache[pagePath] != null) {
            if (this.cache[pagePath] !== this.state.model) {
                this.setState({ model: this.cache[pagePath] });
            }
        } else {
            const url = `/api/page/${pagePath}/index.json`.replace(/\/\/+/g, '\/');
            console.log(url);
            axios.get(url)
                .then((response) => {
                    const model = response.data as PageModel;
                    this.cache[pagePath] = model;
                    this.setState({ model });
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }
}

export default Page;
