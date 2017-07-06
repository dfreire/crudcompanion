import * as React from 'react';
import { Modal } from 'antd';
import * as Util from '../../../../../Util';
import { Props } from '../../../../../types/Props';
import { FormModel } from '../../FormModel';
import { RelationshipFieldModel } from './RelationshipFieldModel';
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
                okText={Util.getCaption(this.props, 'selectN', {n: selectedIds.length})}
                cancelText={Util.getCaption(this.props, 'cancel')}
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
        this.props.onRelationshipModalClose(
            this.props.blockIdx,
            this.props.fieldIdx,
        );
    }
}