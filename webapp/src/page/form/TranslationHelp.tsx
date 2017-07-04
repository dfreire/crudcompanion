import * as _ from 'underscore';
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
    selectedLanguageId?: string;
}

export class TranslationHelp extends React.Component<FieldProps, State> {
    constructor(props: FieldProps) {
        super(props);
        this.state = {};
    }

    render() {
        const record = this.props.formModel.record || {};
        const _translationsByLanguageId = record._translationsByLanguageId || {};

        const languages = this.props.languages.filter(languageId => {
            if (languageId === this.props.language) {
                return false;
            } else {
                const translations = _translationsByLanguageId[languageId] || {};
                return _.size(translations[this.props.fieldModel.key]) > 0;
            }
        });

        const selectedLanguageId = this.state.selectedLanguageId || languages[0];
        const translations = _translationsByLanguageId[selectedLanguageId] || {};
        const translationValue = translations[this.props.fieldModel.key];

        return (
            <div>
                {this._renderLanguages(selectedLanguageId, languages)}
                {this._renderTranslation(translationValue)}
            </div>
        );
    }

    _renderLanguages = (selectedLanguageId: string, languages: string[]) => {
        return (
            <Radio.Group
                style={{ marginTop: 5 }}
                value={selectedLanguageId}
                onChange={this._onChange}
                size="small"
            >
                {languages.map((languageId, i) => {
                    return (
                        <Radio.Button value={languageId}>
                            {languageId}
                        </Radio.Button>
                    );
                })}
            </Radio.Group>
        );
    }

    _onChange = (evt: any) => {
        this.setState({ selectedLanguageId: evt.target.value });
    }

    _renderTranslation = (translationValue: string) => {
        return (
            <p style={{ marginTop: 1, color: '#aaa', lineHeight: '1.75em' }}>
                {translationValue}
            </p>
        );
    }
}
