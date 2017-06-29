import * as _ from 'underscore';
import * as React from 'react';
import { Row, Col, Dropdown, Menu, Button, Icon } from 'antd';
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

        const languages = ['--', ...this.props.languages.filter(languageId => {
            if (languageId === this.props.language) {
                return false;
            } else {
                const translations = _translationsByLanguageId[languageId] || {};
                return _.size(translations[this.props.fieldModel.key]) > 0;
            }
        })];

        const selectedLanguageId = this.state.selectedLanguageId || languages[0];
        const translations = _translationsByLanguageId[selectedLanguageId] || {};
        const translationValue = translations[this.props.fieldModel.key];

        return (
            <Row>
                <Col span={2}>
                    <Dropdown overlay={this._renderMenu(languages)}>
                        <Button type="dashed" size="small">
                            {selectedLanguageId} <Icon type="down" />
                        </Button>
                    </Dropdown>
                </Col>
                <Col span={22}>
                    <p style={{ marginTop: 7, color: '#aaa', lineHeight: '1.75em' }}>
                        {translationValue}
                    </p>
                </Col>
            </Row>
        );
    }

    _renderMenu = (languages: string[]) => {
        const onClick = (params: { item: any, key: string, keyPath: any }) => {
            this.setState({ selectedLanguageId: params.key });
        };

        return (
            <Menu onClick={onClick}>
                {languages.map((languageId, i) => {
                    return (
                        <Menu.Item key={languageId}>{languageId}</Menu.Item>
                    );
                })}
            </Menu>
        );
    }
}
