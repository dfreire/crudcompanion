import * as React from 'react';
import { Form, Input, Icon } from 'antd';
import * as queryString from 'query-string';

import { Link } from '../../../../../Link';
import { Props } from '../../../../../types/Props';
import { FormModel } from '../../FormModel';
import { RelationshipFieldModel } from './RelationshipFieldModel';
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
        return (
            <Form.Item label={this.props.fieldModel.title}>
                <Input
                    type="text"
                    placeholder={this.props.fieldModel.placeholder}
                    value={null/*value*/}
                    disabled={true/*this.props.formModel.isLoading*/}
                    prefix={this._renderValue()}
                    addonAfter={<Icon type="search" onClick={this._onClickedSearch} />}
                    suffix={<Icon type="close" onClick={this._onClickedClear} />}
                />
                <RelationshipModal {...this.props} />
            </Form.Item>
        );
    }

    _renderValue = () => {
        const record = this.props.formModel.record || {};
        const id = record[this.props.fieldModel.key];
        const caption = record[this.props.fieldModel.captionKey];

        const editQueryString = queryString.stringify(
            Object.assign(queryString.parse(this.props.pageContext.querystring), { id })
        );

        return <Link text={caption || id} path={`${this.props.fieldModel.updatePage}?${editQueryString}`} />;
    }

    _onChange = (evt: any) => {
        this.props.onFormChangeRecord(
            this.props.blockIdx,
            this.props.fieldIdx,
            evt.target.value
        );
    }

    _onClickedSearch = () => {
        this.props.onRelationshipModalOpen(
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
