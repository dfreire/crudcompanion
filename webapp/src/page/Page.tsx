import * as React from 'react';
import axios from 'axios';
import { Row, Col, Button } from 'antd';
import { Table, TableModel } from './table/Table';

interface PageModel {
    blocks: BlockModel[];
}

export interface BlockModel {
    type: 'table' | 'form';
    span: number;
}

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
        this.state = { model: { blocks: [] } };
        this.cache = {};
    }

    render() {
        return (
            <div>
                {this._renderBlocks()}
                <Row>
                    <Col span={24} style={{ textAlign: '_right' }}>
                        <Button type="primary" style={{ width: 100, marginRight: 10 }}>Save</Button>
                        <Button style={{ width: 100 }}>Cancel</Button>
                    </Col>
                </Row>
            </div>
        );
    }

    _renderBlocks() {
        return this.state.model.blocks.map((blockModel, i) => {
            return (
                <Row key={i}>
                    <Col span={blockModel.span}>
                        {this._renderBlock(blockModel)}
                    </Col>
                </Row>
            )
        });
    }

    _renderBlock(blockModel: BlockModel) {
        switch (blockModel.type) {
            case 'table':
                return <Table pageContext={this.props.pageContext} model={blockModel as TableModel} />
            default:
                return <p>JSON.stringify(block)</p>
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
            const url = `/api/pagemodel/${pagePath}/index.json`.replace(/\/\/+/g, '\/');
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
