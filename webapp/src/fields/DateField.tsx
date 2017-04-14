import * as React from 'react';
import { DateFieldModel } from '../Model';

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
                <h2>Date Field</h2>
                {JSON.stringify(this.props.model)}
            </div>
        );
    }
}

export default DateField;
