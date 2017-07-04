import * as React from 'react';
import { Radio } from 'antd';
import { Props } from '../../types/Props';
import { FormModel } from '../../types/FormModel';
import { FieldModel } from '../../types/FieldModel';

interface FieldProps extends Props {
    blockIdx: number;
    fieldIdx: number;
    formModel: FormModel;
    fieldModel: FieldModel;
}

interface State {
}

export class TranslationHelp extends React.Component<FieldProps, State> {
    constructor(props: FieldProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                {this._renderLanguages()}
                {this._renderTranslation()}
            </div>
        );
    }

    _renderLanguages = () => {
        const languages = this.props.languageIds.filter(languageId => languageId !== this.props.languageId);

        return (
            <Radio.Group
                style={{ marginTop: 5 }}
                value={this.props.translationId}
                onChange={this._onChange}
                size="small"
            >
                {languages.map((languageId, i) => {
                    return (
                        <Radio.Button value={languageId} key={languageId}>
                            {languageId}
                        </Radio.Button>
                    );
                })}
            </Radio.Group>
        );
    }

    _onChange = (evt: any) => {
        this.props.onFormChangeTranslation(this.props.blockIdx, evt.target.value);
    }

    _renderTranslation = () => {
        const translationRecord = this.props.formModel.translationRecord || {};
        const translationValue = translationRecord[this.props.fieldModel.key];

        return (
            <p style={{ marginTop: 1, color: '#aaa', lineHeight: '1.75em' }}>
                {translationValue}
            </p>
        );
    }
}
