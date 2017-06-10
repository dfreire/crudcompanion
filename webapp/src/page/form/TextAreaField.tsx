import * as React from 'react';
import { Form, Input } from 'antd';
import { Props } from '../../types/Props';
import { FormModel } from '../../types/FormModel';
import { TextAreaFieldModel } from '../../types/TextAreaFieldModel';

interface FieldProps extends Props {
    blockIdx: number;
    fieldIdx: number;
    formModel: FormModel;
    fieldModel: TextAreaFieldModel;
}

interface State {
}

export class TextAreaField extends React.Component<FieldProps, State> {
    constructor(props: FieldProps) {
        super(props);
        this.state = {};
    }

    render() {
        const record = this.props.formModel.record || {};
        const withRows: any = { rows: this.props.fieldModel.rows || 4 };

        return (
            <Form.Item label={this.props.fieldModel.title}>
                <Input
                    type="textarea"
                    {...withRows}
                    placeholder={this.props.fieldModel.placeholder}
                    value={record[this.props.fieldModel.key]}
                    disabled={this.props.formModel.isLoading}
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
