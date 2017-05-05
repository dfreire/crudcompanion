import * as React from 'react';
import * as queryString from 'query-string';
import { Form as AntdForm, Row, Col, Button, Popconfirm } from 'antd';
import * as Util from '../../Util';
import * as Ajax from '../../Ajax';
import { navigateTo } from '../../Link';
import * as Types from '../../types/types';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';
import { SelectOneField } from './SelectOneField';

interface Props {
    pageContext: PageJS.Context;
    language: Types.Language;
    model: Types.FormModel;
}

interface State {
    record: any;
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
            onChange: (fieldKey: string, fieldValue: any) => {
                const record = Object.assign({}, this.state.record);
                record[fieldKey] = fieldValue || null;
                this.setState({ record });
            }
        });

        switch (fieldModel.type) {
            case 'text':
                return <TextField {...commonProps} model={fieldModel as Types.TextFieldModel} />;
            case 'textarea':
                return <TextAreaField {...commonProps} model={fieldModel as Types.TextAreaFieldModel} />;
            case 'select-one':
                return <SelectOneField {...commonProps} model={fieldModel as Types.SelectOneFieldModel} />;
            default:
                return <div />;
        }
    }

    _renderButtons() {
        const onSave = () => {
            const record = Object.assign({}, this.state.record, { language_id: this.props.language });
            Ajax.post(`/api/${this.props.model.saveHandler}`, record)
                .then(() => {
                    navigateTo(this.props.model.cancelPage);
                });
        };

        const onCancel = () => {
            navigateTo(this.props.model.cancelPage);
        };

        const onRemove = () => {
            const qs = queryString.stringify({ id: this.state.record.id });
            Ajax.del(`/api/${this.props.model.removeHandler}/?${qs}`)
                .then(() => {
                    navigateTo(this.props.model.cancelPage);
                });
        };

        return (
            <Row>
                <Col span={12}>
                    <Button type="primary" style={{ width: 100 }} onClick={onSave}>Save</Button>
                    <Button style={{ width: 100, marginLeft: 10 }} onClick={onCancel}>Cancel</Button>
                </Col>
                <Col span={12} style={{textAlign: 'right'}}>
                    {this.props.model.removeHandler != null && (
                        <Popconfirm title="Are you sure?" onConfirm={onRemove} okText="Yes" cancelText="No">
                            <Button type="danger" style={{ width: 100 }}>Remove</Button>
                        </Popconfirm>
                    )}
                </Col>
            </Row>
        );
    }

    componentDidMount() {
        if (this.props.pageContext.querystring != null) {
            this._fetch();
        }
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.props.pageContext.querystring != null
            && this.props.pageContext.querystring !== prevProps.pageContext.querystring) {
            this._fetch();
        }
    }

    _fetch() {
        console.log('[FormBlock] _fetch');
        if (this.props.model.getHandler == null) {
            this.setState({ record: {} });
        } else {
            this.setState({ loading: true });
            Ajax.get(Util.cleanUrl(`/api/${this.props.model.getHandler}?${this.props.pageContext.querystring}`))
                .then((response) => {
                    console.log('[FormBlock]', response);
                    this.setState({ record: response, loading: false });
                });
        }
    }
}
