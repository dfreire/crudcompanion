import * as React from 'react';
import { Form as AntdForm, Button } from 'antd';
import { get } from '../../Ajax';
import { navigateTo } from '../../Link';
import { template } from '../../helpers';
import { BlockModel } from '../Page';
import { TextField, TextFieldModel } from './TextField';
import { TextAreaField, TextAreaFieldModel } from './TextAreaField';

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

        const commonProps = Object.assign({}, this.props, {
            value,
            onChange: (fieldKey: string, evt: any) => {
                let record = Object.assign({}, this.state.record);
                record[fieldKey] = evt.target.value;
                this.setState({ record });
            }
        });

        switch (fieldModel.type) {
            case 'text':
                return <TextField {...commonProps} model={fieldModel as TextFieldModel} />
            case 'textarea':
                return <TextAreaField {...commonProps} model={fieldModel as TextAreaFieldModel} />
            default:
                return <div />
        }
    }

    _renderButtons() {
        const onCancel = () => {
            const url = template(this.props.model.cancelPage, this.props.pageContext);
            navigateTo(url);
        }

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
                    onClick={onCancel}
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
        this.setState({ loading: true });
        get(`/api/${this.props.model.getHandler}?${this.props.pageContext.querystring}`)
            .then((response) => {
                this.setState({ record: response, loading: false });
            })
    }
}
