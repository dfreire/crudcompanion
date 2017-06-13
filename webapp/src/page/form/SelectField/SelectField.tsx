import * as React from 'react';
import { Form, Input, Icon } from 'antd';
import { Props } from '../../../types/Props';
import { FormModel } from '../../../types/FormModel';
import { SelectFieldModel } from '../../../types/SelectFieldModel';
import { SelectModal } from './SelectModal';

interface FieldProps extends Props {
    blockIdx: number;
    fieldIdx: number;
    formModel: FormModel;
    fieldModel: SelectFieldModel;
}

interface State {
    isModelOpen: boolean;
}

export class SelectField extends React.Component<FieldProps, State> {
    constructor(props: FieldProps) {
        super(props);
        this.state = { isModelOpen: false };
    }

    render() {
        const record = this.props.formModel.record || {};

        return (
            <Form.Item label={this.props.fieldModel.title}>
                <Input
                    type="text"
                    placeholder={this.props.fieldModel.placeholder}
                    value={record[this.props.fieldModel.key]}
                    disabled={this.props.formModel.isLoading}
                    suffix={<Icon type="close" onClick={this._onClickedClear} />}
                    addonAfter={<Icon type="search" onClick={this._onClickedSearch} />}
                />
                <SelectModal
                    {...this.props}
                    isModelOpen={this.state.isModelOpen}
                    onClickedSelect={this._onClickedSelect}
                    onClickedCancel={this._onModelClickedCancel}
                />
            </Form.Item>
        );
    }

    _onChange = (evt: any) => {
        this.props.onFormRecordChange(
            this.props.blockIdx,
            this.props.formModel,
            this.props.fieldModel,
            evt.target.value
        );
    }

    _onClickedSearch = () => {
        console.log('_onClickedSearch');
        this.setState({ isModelOpen: true });
    }

    _onClickedClear = () => {
        console.log('_onClickedClear');
    }

    _onClickedSelect = () => {
        console.log('onClickedSelect');
        this.setState({ isModelOpen: false });
    }

    _onModelClickedCancel = () => {
        console.log('_onModelClickedCancel');
        this.setState({ isModelOpen: false });
    }
}
