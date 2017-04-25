import * as React from 'react';
import * as queryString from 'query-string';
import { Table as AntdTable, Button, Menu, Dropdown, Icon, Popconfirm } from 'antd';
import * as Util from '../../Util';
import * as Ajax from '../../Ajax';
import { Link, navigateTo } from '../../Link';
import * as Types from '../../types/types';

interface Props {
    pageContext: PageJS.Context;
    language: Types.Language;
    model: Types.TableModel;
}

interface State {
    records: any[];
    selectedIds: string[];
    loading: boolean;
}

export class Table extends React.Component<Props,
    State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            records: [],
            selectedIds: [],
            loading: false
        };
    }

    render() {
        return (
            <div>
                <h2>{this.props.model.title}</h2>
                {this._renderButtons()}
                <AntdTable
                    columns={this._columns()}
                    dataSource={this._dataSource()}
                    rowSelection={this._rowSelection()}
                    size="middle"
                    bordered={true}
                    loading={this.state.loading}
                    locale={{
                        filterConfirm: 'Ok',
                        filterReset: 'Reset',
                        emptyText: 'No Data'
                    }}
                    pagination={{
                        size: 'small',
                        total: 0,
                        pageSize: 5
                    }}
                />
            </div>
        );
    }

    _renderButtons() {
        const onBulkRemove = () => {
            Ajax.del(`/api/${this.props.model.removeHandler}/?${queryString.stringify({ id: this.state.selectedIds })}`)
                .then(() => {
                    this._fetch();
                });
        };

        const menu = (
            <Menu onClick={onBulkRemove}>
                <Menu.Item key="bulk-remove" disabled={this.state.selectedIds.length === 0}>Remove</Menu.Item>
            </Menu>
        );

        return (
            <div style={{ textAlign: 'left' }}>
                <Button
                    type="primary"
                    style={{ width: 100, marginTop: 10, marginBottom: 10 }}
                    onClick={() => navigateTo(this.props.model.createPage)}
                >
                    Create
                </Button>
                <Dropdown overlay={menu} placement="bottomLeft">
                    <Button style={{ marginLeft: 10 }}>
                        With selected... <Icon type="down" />
                    </Button>
                </Dropdown>
            </div>
        );
    }

    _dataSource() {
        return this.state.records.map((record) => {
            return Object.assign({}, record, { key: record.id });
        });
    }

    _columns() {
        const cols: any[] = this.props.model.cols.map((col) => {
            return { key: col.key, title: col.title, dataIndex: col.key };
        });

        return cols.concat({
            title: 'Action',
            key: 'action',
            width: 100,
            render: (text: string, record: { id: string }) => {
                const editQueryString = queryString.stringify(
                    Object.assign(queryString.parse(this.props.pageContext.querystring), { id: record.id })
                );

                const onRemove = () => {
                    Ajax.del(`/api/${this.props.model.removeHandler}/?${queryString.stringify({ id: record.id })}`)
                        .then(() => {
                            this._fetch();
                        });
                };

                return (
                    <span>
                        <Link text="Edit" path={`${this.props.model.updatePage}?${editQueryString}`} />
                        <span className="ant-divider" />
                        <Popconfirm title="Are you sure?" onConfirm={onRemove} okText="Yes" cancelText="No">
                            <a>Remove</a>
                        </Popconfirm>
                    </span>
                );
            }
        });
    }

    _rowSelection() {
        return {
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({ selectedIds: selectedRowKeys });
            },
            onSelect: (record: any, selected: any, selectedRows: any) => {
                console.log('onSelect', record, selected, selectedRows);
            },
            onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
                console.log('onSelectAll', selected, selectedRows, changeRows);
            }
        };
    }

    componentDidMount() {
        console.log('[TableBlock] componentDidMount');
        if (this.props.pageContext.querystring != null) {
            this._fetch();
        }
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        console.log('[TableBlock] componentDidUpdate', this.state);
        if (this.props.pageContext.querystring != null
            && this.props.pageContext.querystring !== prevProps.pageContext.querystring) {
            this._fetch();
        }
    }

    _fetch() {
        console.log('[TableBlock] _fetch');
        this.setState({ loading: true });
        Ajax
            .get(Util.cleanUrl(`/api/${this.props.model.getHandler}?${this.props.pageContext.querystring}`))
            .then((response) => {
                this.setState({ records: response, loading: false });
            });
    }
}
