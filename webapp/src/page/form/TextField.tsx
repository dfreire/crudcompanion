import * as React from 'react';
import { Form, Input } from 'antd';
import { FieldModel } from './Form';

export interface TextFieldModel extends FieldModel {
    placeholder?: string;
}

interface Props {
    pageContext: PageJS.Context;
    model: TextFieldModel;
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
                <Input placeholder={this.props.model.placeholder} />
            </Form.Item>
        );
    }
}
