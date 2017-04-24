import * as React from 'react';
import { Row, Col, Breadcrumb, Dropdown, Icon, Menu } from 'antd';
import { Link } from '../Link';
import * as Types from '../types/types';
import { Table } from './table/Table';
import { Form } from './form/Form';

interface Props {
    pageContext: PageJS.Context;
    languages: Types.Language[];
    language: Types.Language;
    model: Types.PageModel;

    onSelectedLanguage: {(language: Types.Language): void};
}

interface State {
}

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
            this.props.onSelectedLanguage(params.key as Types.Language);
        };

        const uppercase = { textTransform: 'uppercase' };

        const menu = (
            <Menu onClick={onClick}>
                {this.props.languages.map((language) => {
                    return <Menu.Item key={language} style={uppercase}>{language}</Menu.Item>;
                })}
            </Menu>
        );

        return (
            <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" style={uppercase}>
                    {this.props.language} <Icon type="down" />
                </a>
            </Dropdown>
        );
    }

    _renderBlocks() {
        const blocks = this.props.model.blocks || [];
        return blocks.map((blockModel, i) => {
            return (
                <Row key={i}>
                    <Col span={blockModel.span}>
                        {this._renderBlock(blockModel)}
                    </Col>
                </Row>
            );
        });
    }

    _renderBlock(blockModel: Types.BlockModel) {
        const commonProps = {
            pageContext: this.props.pageContext,
            language: this.props.language,
        };

        switch (blockModel.type) {
            case 'table':
                return <Table {...commonProps} model={blockModel as Types.TableModel} />;
            case 'form':
                return <Form {...commonProps} model={blockModel as Types.FormModel} />;
            default:
                return <p>JSON.stringify(block)</p>;
        }
    }
}
