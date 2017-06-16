import * as React from 'react';
import { Form, Input, Icon } from 'antd';
import { Props } from '../../../types/Props';
import { FormModel } from '../../../types/FormModel';
import { RelationshipFieldModel } from '../../../types/RelationshipFieldModel';
import { RelationshipModal } from './RelationshipModal';

interface FieldProps extends Props {
    blockIdx: number;
    fieldIdx: number;
    formModel: FormModel;
    fieldModel: RelationshipFieldModel;
}

interface State {
}

export class RelationshipField extends React.Component<FieldProps, State> {
    constructor(props: FieldProps) {
        super(props);
        this.state = {

        };
    }

    render() {
        const record = this.props.formModel.record || {};

        return (
            <Form.Item label={this.props.fieldModel.title}>
                <Input
                    type="text"
                    placeholder={this.props.fieldModel.placeholder}
                    value={record[this.props.fieldModel.captionKey] || record[this.props.fieldModel.key]}
                    disabled={this.props.formModel.isLoading}
                    suffix={<Icon type="close" onClick={this._onClickedClear} />}
                    addonAfter={<Icon type="search" onClick={this._onClickedSearch} />}
                />
                <RelationshipModal {...this.props} />
            </Form.Item>
        );
    }

    _onChange = (evt: any) => {
        this.props.onFormChangeRecord(
            this.props.blockIdx,
            this.props.fieldIdx,
            evt.target.value
        );
    }

    _onClickedSearch = () => {
        this.props.onModalOpen(
            this.props.blockIdx,
            this.props.fieldIdx,
        );
    }

    _onClickedClear = () => {
        this.props.onFormChangeRecord(
            this.props.blockIdx,
            this.props.fieldIdx,
            null
        );
    }
}
