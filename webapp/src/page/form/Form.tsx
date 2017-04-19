import * as React from 'react';
import { Form as AntdForm, Button } from 'antd';
import { get } from '../../Ajax';
import { navigateTo } from '../../Link';
import * as Types from '../../types/types';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';


interface Props {
    pageContext: PageJS.Context;
    model: Types.FormModel;
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

    _renderField(fieldModel: Types.FieldModel) {
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
                return <TextField {...commonProps} model={fieldModel as Types.TextFieldModel} />
            case 'textarea':
                return <TextAreaField {...commonProps} model={fieldModel as Types.TextAreaFieldModel} />
            default:
                return <div />
        }
    }

    _renderButtons() {
        const onCancel = () => {
            navigateTo(this.props.model.cancelPage);
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
