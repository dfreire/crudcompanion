import * as _ from 'underscore';
import * as React from 'react';
import * as queryString from 'query-string';
import * as numeral from 'numeral';
import { Table as AntdTable, Button, Menu, Dropdown, Icon, Modal, Popconfirm, Upload, message, Popover } from 'antd';
import { Link, navigateTo } from '../../Link';
import { Props } from '../../types/Props';
import { TableModel } from '../../types/TableModel';
import { TextColumnModel } from '../../types/TextColumnModel';
import { NumberColumnModel } from '../../types/NumberColumnModel';
import { ImageColumnModel } from '../../types/ImageColumnModel';

interface TableProps extends Props {
    blockIdx: number;
    tableModel: TableModel;
}

interface State {
    uploadingMap: { [uid: string]: { percent: number; size: number } };
}

export class Table extends React.Component<TableProps, State> {
    constructor(props: TableProps) {
        super(props);
        this.state = {
            uploadingMap: {},
        };
    }

    render() {
        return (
            <div>
                <h2>{this.props.tableModel.title}</h2>
                {this._renderButtons()}
                <AntdTable
                    columns={this._columns()}
                    dataSource={this._dataSource()}
                    rowSelection={this._rowSelection()}
                    size="middle"
                    bordered={true}
                    loading={this.props.tableModel.isLoading}
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
        const createPage = this.props.tableModel.createPage;

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
        const { uploadHandler } = this.props.tableModel;

        const props = {
            name: 'file',
            action: '/api' + uploadHandler + '?language_id=' + this.props.languageId,
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
                    this.props.onTableUploadedFile(this.props.blockIdx);
                } else if (info.file.status === 'error') {
                    message.error(`Problem uploading: ${info.file.name}`);
                    delete uploadingMap[uid];
                    this.setState({ uploadingMap });
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
        const selectedIds = this.props.tableModel.selectedIds || [];

        const onConfirmBulkRemove = () => {
            this.props.onTableRemoveRecords(this.props.blockIdx, selectedIds);
        };

        const onBulkRemove = () => {
            Modal.confirm({ title: 'Are you sure?', onOk: onConfirmBulkRemove, okText: 'Yes', cancelText: 'No' });
        };

        const menu = (
            <Menu onClick={onBulkRemove}>
                <Menu.Item key="bulk-remove" disabled={selectedIds.length === 0}>Remove</Menu.Item>
            </Menu>
        );

        return (
            <Dropdown overlay={menu} placement="bottomLeft">
                <Button style={{ marginBottom: 10 }}>
                    With {selectedIds.length} selected... <Icon type="down" />
                </Button>
            </Dropdown>
        );
    }

    _dataSource() {
        return (this.props.tableModel.records || []).map((record) => {
            return Object.assign({}, record, { key: record.id });
        });
    }

    _columns() {
        const cols: any[] = this.props.tableModel.cols.map((col) => {
            switch (col.type) {
                case 'text': return this._textColumn(col as TextColumnModel);
                case 'number': return this._numberColumn(col as NumberColumnModel);
                case 'image': return this._imageColumn(col as ImageColumnModel);
                default: return { key: col.key, title: col.title, dataIndex: col.key };
            }
        });

        return cols.concat(this._actionsColumn());
    }

    _textColumn(col: TextColumnModel) {
        return {
            key: col.key,
            title: col.title,
            dataIndex: col.key,
            sorter: (a: object, b: object) => {
                if (a[col.key] < b[col.key]) {
                    return -1;
                } else if (a[col.key] > b[col.key]) {
                    return 1;
                } else {
                    return 0;
                }
            },
        };
    }

    _numberColumn(col: NumberColumnModel) {
        return {
            key: col.key,
            title: col.title,
            dataIndex: col.key,
            className: 'app-td-number',
            render: (text: string, record: { id: string }, index: number) => {
                return <span>{numeral(text).format(col.format)}</span>;
            },
            sorter: (a: object, b: object) => {
                if (a[col.key] < b[col.key]) {
                    return -1;
                } else if (a[col.key] > b[col.key]) {
                    return 1;
                } else {
                    return 0;
                }
            },
        };
    }

    _imageColumn(col: ImageColumnModel) {
        return {
            key: col.key,
            title: col.title,
            dataIndex: col.key,
            className: 'app-td-image',
            render: (text: string, record: { id: string }, index: number) => {
                if (text != null) {
                    return (
                        <Popover placement={col.popoverPlacement} content={<img src={record[col.popoverKey]} />}>
                            <a target="_blank" href={record[col.clickKey]}>
                                <img src={record[col.key]} />
                            </a>
                        </Popover>
                    );
                } else {
                    return <span />;
                }
            },
        };
    }

    _actionsColumn() {
        return {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (text: string, record: { id: string }, index: number) => {
                const editQueryString = queryString.stringify(
                    Object.assign(queryString.parse(this.props.pageContext.querystring), { id: record.id })
                );

                const onRemove = () => {
                    this.props.onTableRemoveRecords(this.props.blockIdx, [record.id]);
                };

                return (
                    <span>
                        <Link text="Edit" path={`${this.props.tableModel.updatePage}?${editQueryString}`} />
                        <span className="ant-divider" />
                        <Popconfirm title="Are you sure?" onConfirm={onRemove} okText="Yes" cancelText="No">
                            <a>Remove</a>
                        </Popconfirm>
                    </span>
                );
            }
        };
    }

    _rowSelection() {
        return {
            // type: 'checkbox' or 'radio'
            selectedRowKeys: this.props.tableModel.selectedIds,
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                this.props.onTableSelectIds(this.props.blockIdx, selectedRowKeys);
            }
        };
    }
}
