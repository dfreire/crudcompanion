import * as React from 'react';
import { Form, Input } from 'antd';
import { Language } from '../../types/Language';
import { TextAreaFieldModel } from '../../types/TextAreaFieldModel';

interface Props {
    pageContext: PageJS.Context;
    language: Language;
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
        const withRows: any = {
            rows: this.props.model.rows || 4
        };

        return (
            <Form.Item label={this.props.model.title}>
                <Input
                    type="textarea"
                    {...withRows}
                    placeholder={this.props.model.placeholder}
                    value={this.props.value}
                    onChange={(evt: any) => this.props.onChange(this.props.model.key, evt.target.value)}
                />
            </Form.Item>
        );
    }
}
