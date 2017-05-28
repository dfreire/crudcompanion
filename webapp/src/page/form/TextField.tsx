import * as React from 'react';
import { Form, Input } from 'antd';
import { Language } from '../../types/Language';
import { TextFieldModel } from '../../types/TextFieldModel';

interface Props {
    pageContext: PageJS.Context;
    language: Language;
    model: TextFieldModel;
    value: string;
    onChange: {(fieldKey: string, evt: any): void};
}

interface State {
}

export class TextField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Form.Item label={this.props.model.title}>
                <Input
                    type="text"
                    placeholder={this.props.model.placeholder}
                    value={this.props.value}
                    onChange={(evt: any) => this.props.onChange(this.props.model.key, evt.target.value)}
                />
            </Form.Item>
        );
    }
}
