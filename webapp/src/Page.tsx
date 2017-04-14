import * as React from 'react';
import axios from 'axios';
import { Row, Col } from 'antd';
import { PageModel, FieldModel, TableFieldModel } from './Model';
import TableField from './fields/TableField';

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
        return this.state.model.fields.map((fieldModel, i) => {
            return (
                <Row key={i}>
                    <Col span={fieldModel.span}>
                        <h2>{fieldModel.title}</h2>
                        {this._renderField(fieldModel)}
                    </Col>
                </Row>
            )
        });
    }

    _renderField(fieldModel: FieldModel) {
        switch (fieldModel.type) {
            case 'table':
                return <TableField pageContext={this.props.pageContext} model={fieldModel as TableFieldModel} />
            default:
                return <p>JSON.stringify(field)</p>
        }
    }

    componentDidMount() {
        console.log('[Page] componentDidMount');
        this._updateModel();
    }

    componentDidUpdate() {
        console.log('[Page] componentDidUpdate');
        this._updateModel();
    }

    _updateModel() {
        const pagePath = this.props.pageContext.path;
        console.log('pageContextPath', pagePath);

        if (this.cache[pagePath] != null) {
            if (this.cache[pagePath] !== this.state.model) {
                this.setState({ model: this.cache[pagePath] });
            }
        } else {
            const url = `/api/page/${pagePath}/index.json`.replace(/\/\/+/g, '\/');
            console.log('page model', url);
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
