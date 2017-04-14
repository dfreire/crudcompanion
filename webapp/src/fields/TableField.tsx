import * as React from 'react';
import axios from 'axios';
import { Table } from 'antd';
import { Link } from '../Link';
import { TableFieldModel } from '../Model';

interface Props {
    pageContext: PageJS.Context;
    model: TableFieldModel;
}

interface State {
    records: any[];
    loading: boolean;
}

class TableField extends React.Component<Props, State> {
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
                <Table
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
                title: col.title,
                dataIndex: col.key,
                key: col.key,
            };
        });

        return cols.concat({
            title: 'Action',
            key: 'action',
            width: 100,
            render: (text: string, record: any) => (
                <span>
                    <Link text="Edit" path={this.props.model.editRowPage} />
                    <span className="ant-divider" />
                    <a href="#">Remove</a>
                </span>
            ),
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
        console.log('[TableField] componentDidMount');
        this._fetch();
    }

    componentDidUpdate() {
        console.log('[TableField] componentDidUpdate');
        // this._fetch();
    }

    _fetch() {
        console.log('fetch', this.props.model.fetchHandler);
        this.setState({ loading: true });
        axios.get(`/api/${this.props.model.fetchHandler}`)
            .then((response) => {
                this.setState({ records: response.data, loading: false });
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

export default TableField;
