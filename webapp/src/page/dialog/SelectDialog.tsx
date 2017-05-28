import * as React from 'react';
//import * as _ from 'underscore';
import * as queryString from 'query-string';
//import { Form, Select, Spin } from 'antd';
import * as Util from '../../Util';
import * as Ajax from '../../Ajax';
import { Language } from '../../types/Language';
import { SelectDialogModel } from '../../types/SelectDialogModel';

interface Props {
    pageContext: PageJS.Context;
    language: Language;
    model: SelectDialogModel;
    value: string;
    onChange: { (fieldKey: string, evt: any): void };
}

interface State {
    dataSource: object[];
    caption: string;
    isLoading: boolean;
}

export class SelectDialog extends React.Component<Props, State> {
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
    }

    render() {
        return (
            <div />
        );
    }

    componentDidMount() {
        const { getHandler } = this.props.model;
        const qs = queryString.stringify({ id: this.props.value, language_id: this.props.language });
        Ajax.get(Util.cleanUrl(`/api/${getHandler}?${qs}`))
            .then((response) => {
            });
    }

    _onChange(caption: string) {
    }

}
