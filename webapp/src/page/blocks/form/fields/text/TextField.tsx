import * as React from 'react';
import { Form, Input, Button } from 'antd';
import { Props } from '../../../../../types/Props';
import { FormModel } from '../../FormModel';
import { TextFieldModel } from './TextFieldModel';

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
            <div>
                <Form.Item label={this.props.fieldModel.title} labelCol={{ span: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                        <Button type="dashed" shape="circle" size="small" icon="flag" />
                    </div>
                    <Input
                        type="text"
                        placeholder={this.props.fieldModel.placeholder}
                        value={record[this.props.fieldModel.key]}
                        disabled={this.props.formModel.isLoading}
                        onChange={this._onChange}
                    />
                </Form.Item>
            </div>
        );
    }

    _onChange = (evt: any) => {
        this.props.onFormChangeRecord(
            this.props.blockIdx,
            this.props.fieldIdx,
            evt.target.value
        );
    }
}
