import * as React from 'react';
import { Row, Col, Breadcrumb, Dropdown, Icon, Menu } from 'antd';
import { Link } from '../Link';
import { Props } from '../types/Props';
import { BlockModel } from './blocks/BlockModel';
import { Table } from './blocks/table/Table';
import { TableModel } from './blocks/table/TableModel';
import { Form } from './blocks/form/Form';
import { FormModel } from './blocks/form/FormModel';

interface State {
};

export class Page extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div style={{ marginTop: 40, marginBottom: 40 }}>
                <Row>
                    <Col span={20}>
                        <a href="/wines">wines</a> | <a href="/pages">pages</a> | <a href="/files">files</a>
                        <br /><br />
                    </Col>
                    <Col span={20}>
                        {this._renderBreadcrumb()}
                    </Col>
                    <Col span={4} style={{ textAlign: 'right' }}>
                        {this._renderLanguage()}
                    </Col>
                </Row>
                {this._renderBlocks()}
            </div>
        );
    }

    _renderBreadcrumb() {
        let tokens = this.props.pageContext.pathname.split('/');

        if (tokens[tokens.length - 1] === '') {
            tokens.pop();
        }

        const breadcrumbs = [];
        let path = '';
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (i === 0) {
                path = '/';
                breadcrumbs.push(<Breadcrumb.Item key={'home'}><Link text="Home" path="/" /></Breadcrumb.Item>);
            } else if (i === tokens.length - 1) {
                breadcrumbs.push(<Breadcrumb.Item key={token}>{token}</Breadcrumb.Item>);
            } else {
                path += token + '/';
                breadcrumbs.push(<Breadcrumb.Item key={token}><Link text={token} path={path} /></Breadcrumb.Item>);
            }
        }

        return (
            <Breadcrumb>
                {breadcrumbs}
            </Breadcrumb>
        );
    }

    _renderLanguage() {
        const onClick = (params: { item: any, key: string, keyPath: any }) => {
            const languageId = params.key;
            this.props.onChangePageLanguage(languageId);
        };

        const uppercase = { textTransform: 'uppercase' };

        const menu = (
            <Menu onClick={onClick}>
                {this.props.languages.map((language) => {
                    return <Menu.Item key={language.id} style={uppercase}>{language.id}</Menu.Item>;
                })}
            </Menu>
        );

        return (
            <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" style={uppercase}>
                    {this.props.languageId} <Icon type="down" />
                </a>
            </Dropdown>
        );
    }

    _renderBlocks() {
        const blocks = this.props.pageModel.blocks || [];
        return blocks.map((blockModel, i) => {
            return (
                <Row key={i}>
                    <Col key={i} span={blockModel.span}>
                        {this._renderBlock(blockModel, i)}
                    </Col>
                </Row>
            );
        });
    }

    _renderBlock(blockModel: BlockModel, i: number) {
        switch (blockModel.type) {
            case 'table':
                const tableModel = blockModel as TableModel;
                console.log(tableModel.title, 'records', tableModel.records);
                return <Table {...this.props} blockIdx={i} tableModel={tableModel} />;
            case 'form':
                const formModel = blockModel as FormModel;
                console.log(formModel.title, 'record', formModel.record);
                return <Form {...this.props} blockIdx={i} formModel={formModel} />;
            default:
                return <p>JSON.stringify(block)</p>;
        }
    }
}
