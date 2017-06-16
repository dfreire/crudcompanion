import * as React from 'react';
import { Form as AntdForm, Row, Col, Button, Popconfirm } from 'antd';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';
import { RelationshipField } from './RelationshipField/RelationshipField';
import { Props } from '../../types/Props';
import { FormModel } from '../../types/FormModel';
import { FieldModel } from '../../types/FieldModel';
import { TextFieldModel } from '../../types/TextFieldModel';
import { TextAreaFieldModel } from '../../types/TextAreaFieldModel';
import { RelationshipFieldModel } from '../../types/RelationshipFieldModel';

interface FormProps extends Props {
    blockIdx: number;
    formModel: FormModel;
}

interface State {
}

export class Form extends React.Component<FormProps, State> {
    constructor(props: FormProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <h2>{this.props.formModel.title}</h2>
                <AntdForm layout="vertical">
                    {this._renderFields()}
                    {this._renderButtons()}
                </AntdForm>
            </div>
        );
    }

    _renderFields() {
        return this.props.formModel.fields.map((fieldModel, i) => {
            return (
                <div key={i}>{this._renderField(fieldModel, i)}</div>
            );
        });
    }

    _renderField(fieldModel: FieldModel, i: number) {
        switch (fieldModel.type) {
            case 'text':
                const textFieldModel = fieldModel as TextFieldModel;
                return <TextField {...this.props} fieldIdx={i} fieldModel={textFieldModel} />;
            case 'textarea':
                const textAreaFieldModel = fieldModel as TextAreaFieldModel;
                return <TextAreaField {...this.props} fieldIdx={i} fieldModel={textAreaFieldModel} />;
            case 'relationship':
                const relationshipFieldModel = fieldModel as RelationshipFieldModel;
                return <RelationshipField {...this.props} fieldIdx={i} fieldModel={relationshipFieldModel} />;
            default:
                return <div />;
        }
    }

    _renderButtons() {
        const onSave = () => {
            this.props.onFormSaveRecord(this.props.blockIdx);
        };

        const onCancel = () => {
            this.props.onFormCancel(this.props.blockIdx);
        };

        const onRemove = () => {
            this.props.onFormRemoveRecord(this.props.blockIdx);
        };

        return (
            <Row>
                <Col span={12}>
                    <Button
                        type="primary"
                        style={{ width: 100 }}
                        onClick={onSave}
                        disabled={this.props.formModel.isLoading}
                    >
                        Save
                    </Button>
                    <Button
                        style={{ width: 100, marginLeft: 10 }}
                        onClick={onCancel}
                        disabled={this.props.formModel.isLoading}
                    >
                        Cancel
                    </Button>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    {this.props.formModel.removeHandler != null && (
                        <Popconfirm title="Are you sure?" onConfirm={onRemove} okText="Yes" cancelText="No">
                            <Button
                                type="danger"
                                style={{ width: 100 }}
                                disabled={this.props.formModel.isLoading}
                            >
                                Remove
                            </Button>
                        </Popconfirm>
                    )}
                </Col>
            </Row>
        );
    }
}
