import * as React from 'react';
import * as queryString from 'query-string';
import { Table as AntdTable } from 'antd';
import { get } from '../../Ajax';
import { Link } from '../../Link';
import { template } from '../../helpers';
import { BlockModel } from '../Page';

export interface TableModel extends BlockModel {
    title?: string;
    span: number;

    cols: {
        type: 'text' | 'number'
        key: string;
        title: string;
        isTranslatable?: boolean;
    }[]

    sortKeys: string[];
    sortKeyToUpdate?: string;

    getHandler: string;
    deleteHandler: string;
    bulkDelete?: boolean;

    createPage: string;

    updatePage: string;
    bulkUpdate?: boolean;
}


interface Props {
    pageContext: PageJS.Context;
    model: TableModel;
}

interface State {
    records: any[];
    loading: boolean;
}

export class Table extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            records: [],
            loading: false,
        };
    }

    render() {
        return (
            <div>
                <h2>{this.props.model.title}</h2>
                <AntdTable
                    columns={this._columns()}
                    dataSource={this._dataSource()}
                    rowSelection={this._rowSelection()}
                    size="middle"
                    bordered={true}
                    loading={this.state.loading}
                />
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
            return {
                key: col.key,
                title: col.title,
                dataIndex: col.key,
            };
        });

        const updatePageUrl = template(this.props.model.updatePage, this.props.pageContext);

        return cols.concat({
            title: 'Action',
            key: 'action',
            width: 100,
            render: (text: string, record: { id: string }) => {
                return (
                    <span>
                        <Link text="Edit" path={`${updatePageUrl}?${queryString.stringify({ id: record.id })}`} />
                        <span className="ant-divider" />
                        <a href="#">Remove</a>
                    </span>
                );
            },
        });
    }

    _rowSelection() {
        return {
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record: any, selected: any, selectedRows: any) => {
                console.log('onSelect', record, selected, selectedRows);
            },
            onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
                console.log('onSelectAll', selected, selectedRows, changeRows);
            },
        };
    }

    componentDidMount() {
        console.log('[TableBlock] componentDidMount');
        this._fetch();
    }

    componentDidUpdate() {
        console.log('[TableBlock] componentDidUpdate');
        // this._fetch();
    }

    _fetch() {
        this.setState({ loading: true });
        get(`/api/${this.props.model.getHandler}`)
            .then((response) => {
                this.setState({ records: response, loading: false });
            });
    }
}
