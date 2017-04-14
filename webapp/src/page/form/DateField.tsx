import * as React from 'react';
import { FieldModel } from './Form';

export interface DateFieldModel extends FieldModel {

}

interface Props {
    pageContext: PageJS.Context;
    model: DateFieldModel;
}

interface State {
}

export class DateField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <h2>DateField</h2>
                {JSON.stringify(this.props.model)}
            </div>
        );
    }
}
