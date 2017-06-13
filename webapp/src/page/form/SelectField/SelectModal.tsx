import * as React from 'react';
import { Modal } from 'antd';
import { Props } from '../../../types/Props';
import { FormModel } from '../../../types/FormModel';
import { SelectFieldModel } from '../../../types/SelectFieldModel';
import { SelectTable } from './SelectTable';

interface FieldProps extends Props {
    blockIdx: number;
    fieldIdx: number;
    formModel: FormModel;
    fieldModel: SelectFieldModel;

    isModelOpen: boolean;
    onClickedSelect: { (): void };
    onClickedCancel: { (): void };
}

interface State {
}

export class SelectModal extends React.Component<FieldProps, State> {
    render() {
        const selectedIds = this.props.fieldModel.selectedIds || [];

        return (
            <Modal
                title={this.props.fieldModel.title}
                visible={this.props.isModelOpen}
                onOk={this.props.onClickedSelect}
                onCancel={this.props.onClickedCancel}
                okText={`Select (${selectedIds.length})`}
                cancelText="Cancel"
            >
                <SelectTable {...this.props} />
            </Modal>
        );
    }
}