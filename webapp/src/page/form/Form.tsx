import * as React from 'react';
import { Form as AntdForm, Row, Col, Button, Popconfirm } from 'antd';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';
//import { SelectOneField } from './SelectOneField';
import { Props } from '../../types/Props';
import { FormModel } from '../../types/FormModel';
import { FieldModel } from '../../types/FieldModel';

interface FormProps extends Props {
    blockIdx: number;
}

interface State {
}

export class Form extends React.Component<FormProps, State> {
    constructor(props: FormProps) {
        super(props);
        this.state = {};
    }

    _getModel(): FormModel {
        return this.props.pageModel.blocks[this.props.blockIdx] as FormModel;
    }

    render() {
        return (
            <div>
                <h2>{this._getModel().title}</h2>
                <AntdForm layout="vertical">
                    {this._renderFields()}
                    {this._renderButtons()}
                </AntdForm>
            </div>
        );
    }

    _renderFields() {
        return this._getModel().fields.map((fieldModel, i) => {
            return (
                <div key={i}>{this._renderField(fieldModel, i)}</div>
            );
        });
    }

    _renderField(fieldModel: FieldModel, i: number) {
        switch (fieldModel.type) {
            case 'text':
                return <TextField {...this.props} fieldIdx={i} />;
            case 'textarea':
                return <TextAreaField {...this.props} fieldIdx={i} />;
            /*
            case 'select-one':
                return <SelectOneField {...this.props} fieldKey={fieldModel.key} />;
            */
            default:
                return <div />;
        }
    }

    _renderButtons() {
        const onSave = () => {
            this.props.onFormRecordSave(this.props.blockIdx);
        };

        const onCancel = () => {
            this.props.onFormCancel(this.props.blockIdx);
        };

        const onRemove = () => {
            this.props.onFormRecordRemove(this.props.blockIdx);
        };

        return (
            <Row>
                <Col span={12}>
                    <Button type="primary" style={{ width: 100 }} onClick={onSave}>Save</Button>
                    <Button style={{ width: 100, marginLeft: 10 }} onClick={onCancel}>Cancel</Button>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    {this._getModel().removeHandler != null && (
                        <Popconfirm title="Are you sure?" onConfirm={onRemove} okText="Yes" cancelText="No">
                            <Button type="danger" style={{ width: 100 }}>Remove</Button>
                        </Popconfirm>
                    )}
                </Col>
            </Row>
        );
    }
}
