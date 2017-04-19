import * as React from 'react';
import { Form, Input } from 'antd';
import * as Types from '../../types/types';

interface Props {
    pageContext: PageJS.Context;
    model: Types.TextFieldModel;
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
                    onChange={evt => this.props.onChange(this.props.model.key, evt)}
                />
            </Form.Item>
        );
    }
}
