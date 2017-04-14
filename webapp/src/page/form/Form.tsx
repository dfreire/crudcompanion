import * as React from 'react';
import axios from 'axios';
import { Form as AntdForm, Button } from 'antd';
import { navigateTo } from '../../Link';
import { BlockModel } from '../Page';
import { TextField, TextFieldModel } from './TextField';

export interface FormModel extends BlockModel {
    title?: string;
    span: number;
    fields: FieldModel[]
    fetchHandler: string;
    saveHandler: string;
    cancelPage: string;
}

export interface FieldModel {
    type: 'text' | 'textarea';
    title: string;
}


interface Props {
    pageContext: PageJS.Context;
    model: FormModel;
}

interface State {
    records: any[];
    loading: boolean;
}

export class Form extends React.Component<Props, State> {
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
        switch (fieldModel.type) {
            case 'text':
                return <TextField {...this.props} model={fieldModel as TextFieldModel} />
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
        //this._fetch();
    }

    componentDidUpdate() {
        console.log('[FormBlock] componentDidUpdate');
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
