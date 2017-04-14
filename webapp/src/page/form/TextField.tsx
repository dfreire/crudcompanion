import * as React from 'react';
import { FieldModel } from './FieldModel';

export interface DateFieldModel extends FieldModel {

}

interface Props {
    pageContext: PageJS.Context;
    model: DateFieldModel;
}

interface State {
}

class DateField extends React.Component<Props, State> {
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

export default DateField;
