import * as React from 'react';
import { Form, Input } from 'antd';
import { Props } from '../../types/Props';
import { FormModel } from '../../types/FormModel';
import { TextFieldModel } from '../../types/TextFieldModel';

interface FieldProps extends Props {
    blockIdx: number;
    fieldIdx: number;
}

interface State {
}

export class TextField extends React.Component<FieldProps, State> {
    constructor(props: FieldProps) {
        super(props);
        this.state = {};
    }

    _getModel(): TextFieldModel {
        const formModel = this.props.pageModel.blocks[this.props.blockIdx] as FormModel;
        return (formModel.fields[this.props.fieldIdx] as TextFieldModel) || {};
    }

    _getRecord(): any {
        const formModel = this.props.pageModel.blocks[this.props.blockIdx] as FormModel;
        return formModel.record || {};
    }

    render() {
        return (
            <Form.Item label={this._getModel().title}>
                <Input
                    type="text"
                    placeholder={this._getModel().placeholder}
                    value={this._getRecord()[this._getModel().key]}
                    onChange={(evt: any) => this.props.onFormRecordChange(this.props.blockIdx, this._getModel().key, evt.target.value)}
                />
            </Form.Item>
        );
    }
}
