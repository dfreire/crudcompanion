import * as React from 'react';
import { Card } from 'antd';
import { Props } from '../../../../../types/Props';
import { FormModel } from '../../FormModel';
import { ThumbnailFieldModel } from './ThumbnailFieldModel';

interface FieldProps extends Props {
    blockIdx: number;
    fieldIdx: number;
    formModel: FormModel;
    fieldModel: ThumbnailFieldModel;
}

interface State {
}

export class ThumbnailField extends React.Component<FieldProps, State> {
    constructor(props: FieldProps) {
        super(props);
        this.state = {};
    }

    render() {
        const record = this.props.formModel.record || {};
        const value = record[this.props.fieldModel.key];

        if (value != null) {
            return (
                <Card>
                    <a target="_blank" href={record[this.props.fieldModel.clickKey]}>
                        <img src={value} />
                    </a>
                </Card>
            );
        } else {
            return <div />;
        }
    }
}
