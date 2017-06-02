import * as React from 'react';
import { Form, Input } from 'antd';
import { Props } from '../../types/Props';
import { FormModel } from '../../types/FormModel';
import { TextAreaFieldModel } from '../../types/TextAreaFieldModel';

interface FieldProps extends Props {
    blockIdx: number;
    fieldIdx: number;
}

interface State {
}

export class TextAreaField extends React.Component<FieldProps, State> {
    constructor(props: FieldProps) {
        super(props);
        this.state = {};
    }

    _getModel(): TextAreaFieldModel {
        const formModel = this.props.pageModel.blocks[this.props.blockIdx] as FormModel;
        return (formModel.fields[this.props.fieldIdx] as TextAreaFieldModel) || {};
    }

    _getRecord(): any {
        const formModel = this.props.pageModel.blocks[this.props.blockIdx] as FormModel;
        return formModel.record || {};
    }

    render() {
        const withRows: any = {
            rows: this._getRecord().rows || 4
        };

        return (
            <Form.Item label={this._getModel().title}>
                <Input
                    type="textarea"
                    {...withRows}
                    placeholder={this._getModel().placeholder}
                    value={this._getRecord()[this._getModel().key]}
                    onChange={(evt: any) => this.props.onFormRecordChange(this.props.blockIdx, this._getModel().key, evt.target.value)}
                />
            </Form.Item>
        );
    }
}


