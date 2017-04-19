import * as React from 'react';
import * as Types from '../../types/types';

interface Props {
    pageContext: PageJS.Context;
    model: Types.DateFieldModel;
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
