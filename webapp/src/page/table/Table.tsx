import * as _ from 'underscore';
import * as React from 'react';
import * as queryString from 'query-string';
import { Table as AntdTable, Button, Menu, Dropdown, Icon, Modal, Popconfirm, Upload, message } from 'antd';
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
    uploadingMap: { [uid: string]: { percent: number; size: number } };
    isLoading: boolean;
}

export class Table extends React.Component<Props, State> {
    private _debouncedFetch: {(): void};

    constructor(props: Props) {
        super(props);
        this.state = {
            records: [],
            selectedIds: [],
            isLoading: false,
            uploadingMap: {},
        };
        this._debouncedFetch = _.debounce(this._fetch.bind(this), 500);
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
                    loading={this.state.isLoading}
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
        return (
            <div style={{ textAlign: 'left' }}>
                {this._renderCreateButton()}
                {this._renderUploadButton()}
                {this._renderBulkActionsButton()}
            </div>
        );
    }

    _renderCreateButton() {
        const createPage = this.props.model.createPage;

        if (createPage == null) {
            return <span />;
        } else {
            return (
                <Button
                    type="primary"
                    style={{ width: 100, marginTop: 10, marginRight: 10, marginBottom: 10 }}
                    onClick={() => navigateTo(createPage)}
                >
                    Create
                </Button>
            );
        }
    }

    _renderUploadButton() {
        const uploadHandler = this.props.model.uploadHandler;

        const props = {
            name: 'file',
            action: '/api/file/upload/',
            multiple: true,
            showUploadList: false,
            headers: {},
            onChange: (info: any) => {
                const { uploadingMap } = this.state;
                const { uid, percent, size } = info.file;

                if (info.file.status === 'uploading') {
                    uploadingMap[uid] = { percent, size };
                    this.setState({ uploadingMap });
                } else if (info.file.status === 'done') {
                    // message.success(`Uploaded: ${info.file.name}`);
                    delete uploadingMap[uid];
                    this.setState({ uploadingMap });
                    this._debouncedFetch();
                } else if (info.file.status === 'error') {
                    message.error(`Problem uploading: ${info.file.name}`);
                    delete uploadingMap[uid];
                    this.setState({ uploadingMap });
                    this._debouncedFetch();
                }
            },
        };

        if (uploadHandler == null) {
            return <span />;
        } else {
            const uploaded = _(this.state.uploadingMap).values()
                .reduce((acc: number, item: any) => (acc + (item.percent / 100 * item.size)), 0);
            const total = _(this.state.uploadingMap).values()
                .reduce((acc: number, item: any) => (acc + item.size), 0);

            const uploadingSpan = () => {
                return <span>({Math.round(uploaded * 100 / total)}%) <Icon type="loading" /></span>;
            };

            return (
                <Upload {...props}>
                    <Button
                        type="primary"
                        style={{ minWidth: 100, marginTop: 10, marginRight: 10, marginBottom: 10 }}
                        disabled={total > 0}
                    >
                        Upload {total > 0 ? uploadingSpan() : <span />}
                    </Button>
                </Upload>
            );
        }
    }

    _renderBulkActionsButton() {
        const onConfirmBulkRemove = () => {
            Ajax.del(`/api/${this.props.model.removeHandler}/?${queryString.stringify({ id: this.state.selectedIds })}`)
                .then(() => {
                    this.setState({ selectedIds: [] });
                    this._fetch();
                });
        };

        const onBulkRemove = () => {
            Modal.confirm({ title: 'Are you sure?', onOk: onConfirmBulkRemove, okText: 'Yes', cancelText: 'No' });
        };

        const menu = (
            <Menu onClick={onBulkRemove}>
                <Menu.Item key="bulk-remove" disabled={this.state.selectedIds.length === 0}>Remove</Menu.Item>
            </Menu>
        );

        return (
            <Dropdown overlay={menu} placement="bottomLeft">
                <Button style={{ marginBottom: 10 }}>
                    With {this.state.selectedIds.length} selected... <Icon type="down" />
                </Button>
            </Dropdown>
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
                            const selectedIds = _.without(this.state.selectedIds, record.id);
                            this.setState({ selectedIds });
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
            // type: 'checkbox' or 'radio'
            selectedRowKeys: this.state.selectedIds,
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                this.setState({ selectedIds: selectedRowKeys });
            }
        };
    }

    componentDidMount() {
        if (this.props.pageContext.querystring != null) {
            this._fetch();
        }
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.props.pageContext.querystring != null
            && this.props.pageContext.querystring !== prevProps.pageContext.querystring) {
            this._fetch();
        }
    }

    _fetch() {
        console.log('[TableBlock] _fetch');
        this.setState({ isLoading: true });
        const { getHandler } = this.props.model;
        const qs = queryString.stringify({ language_id: this.props.language });
        Ajax.get(Util.cleanUrl(`/api/${getHandler}?${qs}`))
            .then((response) => {
                console.log('[TableBlock]', response);
                this.setState({ records: response, isLoading: false });
            });
    }
}
