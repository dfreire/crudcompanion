import * as React from 'react';
import axios from 'axios';
import { Row, Col, Breadcrumb, Dropdown, Icon, Menu } from 'antd';
import { Link, navigateTo } from '../Link';
import { cleanUrl } from '../helpers';
import { Language } from '../App';
import { Table, TableModel } from './table/Table';
import { Form, FormModel } from './form/Form';

interface PageModel {
    redirect?: string;
    blocks?: BlockModel[];
}

export interface BlockModel {
    type: 'table' | 'form';
    span: number;
}

interface Props {
    pageContext: PageJS.Context;
    languages: Language[];
}

interface State {
    model: PageModel;
    language: Language;
}

class Page extends React.Component<Props, State> {
    private cache: { [key: string]: PageModel };

    constructor(props: Props) {
        super(props);
        this.cache = {};
        this.state = {
            model: { blocks: [] },
            language: this.props.languages[0],
        };
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

        if (tokens[tokens.length - 1] === "") {
            tokens.pop();
        }

        console.log('tokens', JSON.stringify(tokens));

        const breadcrumbs = [];
        let path = "";
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (i === 0) {
                path = "/";
                breadcrumbs.push(<Breadcrumb.Item key={"home"}><Link text="Home" path="/" /></Breadcrumb.Item>);
            } else if (i === tokens.length - 1) {
                breadcrumbs.push(<Breadcrumb.Item key={token}>{token}</Breadcrumb.Item>);
            } else {
                path += "/" + token;
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
        const onClick = (param: {item: any, key: any, keyPath: any}) => {
            this.setState({ language: param.key as Language });
        }

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
                    {this.state.language} <Icon type="down" />
                </a>
            </Dropdown>
        );
    }

    _renderBlocks() {
        const blocks = this.state.model.blocks || [];
        return blocks.map((blockModel, i) => {
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
        const commonProps = {
            pageContext: this.props.pageContext,
            language: this.state.language,
        };

        switch (blockModel.type) {
            case 'table':
                return <Table {...commonProps} model={blockModel as TableModel} />
            case 'form':
                return <Form {...commonProps} model={blockModel as FormModel} />
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
        const pathname = this.props.pageContext.pathname;
        console.log('pathname', pathname);

        if (this.cache[pathname] != null) {
            const cachedModel = this.cache[pathname];
            if (cachedModel.redirect != null) {
                navigateTo(cachedModel.redirect);
            } else if (cachedModel !== this.state.model) {
                this.setState({ model: cachedModel });
            }
        } else {
            const url = cleanUrl(`/api/contentmodel/${pathname}/index.json`);
            console.log('page model', url);
            axios.get(url)
                .then((response) => {
                    const model = response.data as PageModel;
                    this.cache[pathname] = model;
                    if (model.redirect != null) {
                        navigateTo(model.redirect);
                    } else {
                        this.setState({ model });
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }
}

export default Page;
