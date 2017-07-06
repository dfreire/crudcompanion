import * as React from 'react';
import { Form as AntdForm, Row, Col, Button, Popconfirm } from 'antd';
import * as Util from '../../../Util';
import { Props } from '../../../types/Props';
import { FormModel } from './FormModel';
import { FieldModel } from './fields/FieldModel';
import { TextField } from './fields/text/TextField';
import { TextFieldModel } from './fields/text/TextFieldModel';
import { TextAreaField } from './fields/textarea/TextAreaField';
import { TextAreaFieldModel } from './fields/textarea/TextAreaFieldModel';
import { ThumbnailField } from './fields/thumbnail/ThumbnailField';
import { ThumbnailFieldModel } from './fields/thumbnail/ThumbnailFieldModel';
import { RelationshipField } from './fields/relationship/RelationshipField';
import { RelationshipFieldModel } from './fields/relationship/RelationshipFieldModel';

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
            case 'thumbnail':
                const thumbnailFieldModel = fieldModel as ThumbnailFieldModel;
                return <ThumbnailField {...this.props} fieldIdx={i} fieldModel={thumbnailFieldModel} />;
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
                        {Util.getCaption(this.props, 'save')}
                    </Button>
                    <Button
                        style={{ width: 100, marginLeft: 10 }}
                        onClick={onCancel}
                        disabled={this.props.formModel.isLoading}
                    >
                        {Util.getCaption(this.props, 'cancel')}
                    </Button>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    {this.props.formModel.removeHandler != null && (
                        <Popconfirm
                            title={Util.getCaption(this.props, 'areYouSure')}
                            onConfirm={onRemove}
                            okText={Util.getCaption(this.props, 'yes')}
                            cancelText={Util.getCaption(this.props, 'no')}
                        >
                            <Button
                                type="danger"
                                style={{ width: 100 }}
                                disabled={this.props.formModel.isLoading}
                            >
                                {Util.getCaption(this.props, 'remove')}
                            </Button>
                        </Popconfirm>
                    )}
                </Col>
            </Row>
        );
    }
}
