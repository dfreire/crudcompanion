import * as React from 'react';
import * as numeral from 'numeral';
import { Table as AntdTable, Popover } from 'antd';
import { Props } from '../../../types/Props';
import { FormModel } from '../../../types/FormModel';
import { SelectFieldModel } from '../../../types/SelectFieldModel';
import { TextColumnModel } from '../../../types/TextColumnModel';
import { NumberColumnModel } from '../../../types/NumberColumnModel';
import { ImageColumnModel } from '../../../types/ImageColumnModel';

interface SelectTableProps extends Props {
    blockIdx: number;
    fieldIdx: number;
    formModel: FormModel;
    fieldModel: SelectFieldModel;
}

interface State {
}

export class SelectTable extends React.Component<SelectTableProps, State> {
    constructor(props: SelectTableProps) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
                <AntdTable
                    columns={this._columns()}
                    dataSource={this._dataSource()}
                    rowSelection={this._rowSelection()}
                    size="middle"
                    bordered={true}
                    loading={this.props.fieldModel.isLoading}
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

    _dataSource() {
        return (this.props.fieldModel.records || []).map((record) => {
            return Object.assign({}, record, { key: record.id });
        });
    }

    _columns() {
        const cols: any[] = this.props.fieldModel.cols.map((col) => {
            switch (col.type) {
                case 'text': return this._textColumn(col as TextColumnModel);
                case 'number': return this._numberColumn(col as NumberColumnModel);
                case 'image': return this._imageColumn(col as ImageColumnModel);
                default: return { key: col.key, title: col.title, dataIndex: col.key };
            }
        });

        return cols;
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

    _rowSelection() {
        return {
            // type: 'checkbox' or 'radio'
            selectedRowKeys: this.props.fieldModel.selectedIds,
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                // this.props.onTableSelectIds(this.props.blockIdx, this.props.fieldModel, selectedRowKeys);
            }
        };
    }
}
