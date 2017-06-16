import * as React from 'react';
import { Modal } from 'antd';
import { Props } from '../../../types/Props';
import { FormModel } from '../../../types/FormModel';
import { RelationshipFieldModel } from '../../../types/RelationshipFieldModel';
import { RelationshipTable } from './RelationshipTable';

interface FieldProps extends Props {
    blockIdx: number;
    fieldIdx: number;
    formModel: FormModel;
    fieldModel: RelationshipFieldModel;
}

interface State {
}

export class RelationshipModal extends React.Component<FieldProps, State> {
    render() {
        const selectedIds = this.props.fieldModel.selectedIds || [ ];

        return (
            <Modal
                title={this.props.fieldModel.title}
                visible={this.props.fieldModel.isModalOpen}
                onOk={this._onOk}
                onCancel={this._onCancel}
                okText={`Select (${selectedIds.length})`}
                cancelText="Cancel"
            >
                <RelationshipTable {...this.props} />
            </Modal>
        );
    }

    _onOk = () => {
        this.props.onFormChangeRecord(
            this.props.blockIdx,
            this.props.fieldIdx,
            this.props.fieldModel.selectedIds,
        );
    }

    _onCancel = () => {
        this.props.onModalClose(
            this.props.blockIdx,
            this.props.fieldIdx,
        );
    }
}