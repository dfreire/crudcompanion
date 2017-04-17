import * as React from 'react';
import { Form, Input } from 'antd';
import { FieldModel } from './Form';

export interface TextAreaFieldModel extends FieldModel {
    placeholder?: string;
    isTranslatable?: boolean;
    rows?: number;
}

interface Props {
    pageContext: PageJS.Context;
    model: TextAreaFieldModel;
    value: string;
    onChange: {(fieldKey: string, evt: any): void};
}

interface State {
}

export class TextAreaField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        const withRows = {
            rows: this.props.model.rows || 4
        }

        return (
            <Form.Item label={this.props.model.title}>
                <Input
                    type="textarea"
                    {...withRows}
                    placeholder={this.props.model.placeholder}
                    value={this.props.value}
                    onChange={evt => this.props.onChange(this.props.model.key, evt)}
                />
            </Form.Item>
        );
    }
}
