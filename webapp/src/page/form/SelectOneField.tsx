import * as React from 'react';
import * as _ from 'underscore';
import * as queryString from 'query-string';
import { Form, Select, Spin } from 'antd';
import * as Util from '../../Util';
import * as Ajax from '../../Ajax';
import * as Types from '../../types/types';

interface Props {
    pageContext: PageJS.Context;
    language: Types.Language;
    model: Types.SelectOneFieldModel;
    value: string;
    onChange: { (fieldKey: string, evt: any): void };
}

interface State {
    dataSource: object[];
    caption: string;
    isLoading: boolean;
}

export class SelectOneField extends React.Component<Props, State> {
    private lastFetchId: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            dataSource: [],
            caption: '',
            isLoading: false,
        };
        this.lastFetchId = 0;
        this._onChange = this._onChange.bind(this);
        this._onSearch = _.debounce(this._onSearch, 300).bind(this);
    }

    render() {
        return (
            <Form.Item label={this.props.model.title}>
                <Select
                    mode="combobox"
                    labelInValue={false}
                    value={this.state.caption}
                    placeholder={this.props.model.placeholder}
                    notFoundContent={this.state.isLoading ? <Spin size="small" /> : null}
                    filterOption={false}
                    onChange={this._onChange}
                    onSearch={this._onSearch}
                >
                    {this.state.dataSource.map((item: any) => {
                        const caption = item[this.props.model.captionKey];
                        return <Select.Option key={caption}>{caption}</Select.Option>;
                    })}
                </Select>
            </Form.Item>
        );
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.value == null) {
            this.setState({ caption: '' });

        } else if (this.props.value !== nextProps.value || this.props.language !== nextProps.language) {
            const { getHandler } = this.props.model;
            const qs = queryString.stringify({ id: nextProps.value, language_id: nextProps.language });
            Ajax.get(Util.cleanUrl(`/api/${getHandler}?${qs}`))
                .then((response) => {
                    console.log('respponse', response);
                    this.setState({ caption: response[this.props.model.captionKey] });
                });
        }
    }

    _onChange(caption: string) {
        this._fireSelected(caption, this.state.dataSource);
        this.setState({ caption });
    }

    _onSearch(searchValue: any) {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;

        this.setState({ isLoading: true });

        const { searchHandler } = this.props.model;
        const qs = queryString.stringify({ language_id: this.props.language });

        Ajax.get(Util.cleanUrl(`/api/${searchHandler}?${qs}`))
            .then((response) => {
                if (fetchId !== this.lastFetchId) {
                    return;
                }
                const dataSource = response.map((item: any) => {
                    return {
                        [this.props.model.valueKey]: item[this.props.model.valueKey],
                        [this.props.model.captionKey]: item[this.props.model.captionKey]
                    };
                });

                this._fireSelected(this.state.caption, dataSource);
                this.setState({ dataSource, isLoading: false });
            });
    }

    _fireSelected(caption: string, dataSource: object[]) {
        const _caption = caption || '';
        const _datasource = dataSource || [];
        const { captionKey, valueKey } = this.props.model;
        const selected = _datasource.find(item => item[captionKey] === _caption.trim()) || {};
        this.props.onChange(this.props.model.key, selected[valueKey]);
    }
}
