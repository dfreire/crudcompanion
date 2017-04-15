import * as React from 'react';
import axios from 'axios';
import { Form as AntdForm, Button } from 'antd';
import { navigateTo } from '../../Link';
import { cleanUrl } from '../../helpers';
import { BlockModel } from '../Page';
import { TextField, TextFieldModel } from './TextField';

export interface FormModel extends BlockModel {
    title?: string;
    span: number;
    fields: FieldModel[]
    getHandler: string;
    saveHandler: {
        method: 'POST' | 'PUT' | 'PATCH';
        url: string;
    };
    cancelPage: string;
}

export interface FieldModel {
    type: 'text' | 'textarea';
    key: string;
    title: string;
}


interface Props {
    pageContext: PageJS.Context;
    model: FormModel;
}

interface State {
    record: object;
    loading: boolean;
}

export class Form extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            record: {},
            loading: false,
        };
    }

    render() {
        return (
            <div>
                <h2>{this.props.model.title}</h2>
                <AntdForm layout="vertical">
                    {this._renderFields()}
                    {this._renderButtons()}
                </AntdForm>
            </div>
        );
    }

    _renderFields() {
        return this.props.model.fields.map((fieldModel, i) => {
            return (
                <div key={i}>{this._renderField(fieldModel)}</div>
            );
        });
    }

    _renderField(fieldModel: FieldModel) {
        const value = this.state.record[fieldModel.key];
        console.log('record', this.state.record);
        console.log('key', fieldModel.key);
        console.log('value', value);


        switch (fieldModel.type) {
            case 'text':
                return <TextField {...this.props} model={fieldModel as TextFieldModel} value={value} />
            default:
                return <div />
        }
    }

    _renderButtons() {
        return (
            <div>
                <Button
                    type="primary"
                    style={{ width: 100, marginRight: 10 }}
                >
                    Save
                </Button>
                <Button
                    style={{ width: 100 }}
                    onClick={() => navigateTo(this.props.model.cancelPage)}
                >
                    Cancel
                </Button>
            </div>
        );
    }

    componentDidMount() {
        console.log('[FormBlock] componentDidMount');
        this._fetch();
    }

    componentDidUpdate() {
        console.log('[FormBlock] componentDidUpdate');
        // this._fetch();
    }

    _fetch() {
        console.log('fetch', this.props.model.getHandler);
        this.setState({ loading: true });
        axios.get(cleanUrl(`/api/${this.props.model.getHandler}?${this.props.pageContext.querystring}`))
            .then((response) => {
                this.setState({ record: response.data, loading: false });
            })
            .catch((error) => {
                console.error(error);
            });
    }
}
