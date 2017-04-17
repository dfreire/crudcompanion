import * as React from 'react';
import { Row, Col, Breadcrumb, Dropdown, Icon, Menu } from 'antd';
import { Link, navigateTo } from '../Link';
import { get } from '../Ajax';
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
}

class Page extends React.Component<Props, State> {
    private cache: { [key: string]: PageModel };

    constructor(props: Props) {
        super(props);
        this.cache = {};
        this.state = {
            model: { blocks: [] },
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
                path += token + "/";
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
        const onClick = (param: {item: any, key: string, keyPath: any}) => {
            const tokens = this.props.pageContext.path.split('/');
            tokens[1] = param.key; // language
            const newPath = tokens.join('/');
            navigateTo(newPath);
        }

        const language = this.props.pageContext.pathname.split('/')[1];
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
                    {language} <Icon type="down" />
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
        if (this.cache[pathname] != null) {
            const cachedModel = this.cache[pathname];
            if (cachedModel.redirect != null) {
                navigateTo(cachedModel.redirect);
            } else if (cachedModel !== this.state.model) {
                this.setState({ model: cachedModel });
            }
        } else {
            get(`/api/contentmodel/${pathname}/index.json`)
                .then((response) => {
                    const model = response as PageModel;
                    this.cache[pathname] = model;
                    if (model.redirect != null) {
                        navigateTo(model.redirect);
                    } else {
                        this.setState({ model });
                    }
                });
        }
    }
}

export default Page;
