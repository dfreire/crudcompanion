import * as React from 'react';
import { Form, Input } from 'antd';
import { Props } from '../../types/Props';
import { FormModel } from '../../types/FormModel';
import { TextAreaFieldModel } from '../../types/TextAreaFieldModel';
import { TranslationHelp } from './TranslationHelp';

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

        return (
            <Form.Item label={this.props.fieldModel.title}>
                <Input
                    autosize={{ minRows: this.props.fieldModel.rows, maxRows: 30 }}
                    type="textarea"
                    placeholder={this.props.fieldModel.placeholder}
                    value={record[this.props.fieldModel.key]}
                    disabled={this.props.formModel.isLoading}
                    onChange={this._onChange}
                />
                <TranslationHelp {...this.props} />
            </Form.Item>
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
