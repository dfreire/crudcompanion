import * as React from 'react';
import { Form, Input } from 'antd';
import { Props } from '../../types/Props';
import { FormModel } from '../../types/FormModel';
import { TextFieldModel } from '../../types/TextFieldModel';

interface FieldProps extends Props {
    blockIdx: number;
    fieldIdx: number;
    formModel: FormModel;
    fieldModel: TextFieldModel;
}

interface State {
}

export class TextField extends React.Component<FieldProps, State> {
    constructor(props: FieldProps) {
        super(props);
        this.state = {};
    }

    render() {
        const record = this.props.formModel.record || {};

        return (
            <Form.Item label={this.props.fieldModel.title}>
                <Input
                    type="text"
                    placeholder={this.props.fieldModel.placeholder}
                    value={record[this.props.fieldModel.key]}
                    onChange={this._onChange}
                />
            </Form.Item>
        );
    }

    _onChange = (evt: any) => {
        this.props.onFormRecordChange(
            this.props.blockIdx,
            this.props.formModel,
            this.props.fieldModel,
            evt.target.value
        );
    }
}
