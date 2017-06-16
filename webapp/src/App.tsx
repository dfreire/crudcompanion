import * as _ from 'underscore';
import * as React from 'react';
import * as page from 'page';
import * as queryString from 'query-string';
import * as Util from './Util';
import * as Ajax from './Ajax';
import { State } from './types/State';
import { Props } from './types/Props';
import { Language } from './types/Language';
import { PageModel } from './types/PageModel';
import { BlockModel } from './types/BlockModel';
import { TableModel } from './types/TableModel';
import { FormModel } from './types/FormModel';
import { RelationshipFieldModel } from './types/RelationshipFieldModel';
import { Page } from './page/Page';

class App extends React.Component<{}, State> {
    private handlers: any;

    constructor(props: {}) {
        super(props);
        this.state = {
            languages: [],
            language: '',
            pageModel: { blocks: [] },
            shouldFetchBlocks: false,
        };

        this.handlers = {
            onPageRelationshipLanguage: (language: Language) => {
                const { pageContext } = this.state;
                if (pageContext != null) {
                    const query = { ...queryString.parse(pageContext.querystring), language_id: language };
                    page(Util.cleanUrl(`${pageContext.pathname}/?${queryString.stringify(query)}`));
                }
            },

            onTableSelectIds: (blockIdx: number, selectedIds: string[]) => {
                const state = { ...this.state };
                (state.pageModel.blocks[blockIdx] as TableModel).selectedIds = selectedIds;
                this.setState(state);
            },

            onTableRemoveRecords: (blockIdx: number, recordIds: string[]) => {
                let tableModel = this.state.pageModel.blocks[blockIdx] as TableModel;
                const removeHandler = tableModel.removeHandler;
                Ajax.del(`/api/${removeHandler}/?${queryString.stringify({ id: recordIds })}`)
                    .then(() => {
                        tableModel.selectedIds = _.filter(tableModel.selectedIds, (selectedId) => {
                            return recordIds.indexOf(selectedId) === -1;
                        });
                        tableModel.records = _.filter(tableModel.records || [], (record: any) => {
                            return recordIds.indexOf(record.id) === -1;
                        });
                        const state = { ...this.state };
                        state.pageModel.blocks[blockIdx] = tableModel;
                        this.setState(state);
                    });
            },

            onTableUploadedFile: (blockIdx: number) => {
                this._fetchBlock(this.state.pageModel.blocks[blockIdx], blockIdx);
            },

            onFormChangeRecord: (blockIdx: number, fieldIdx: number, value: any) => {
                const formModel = this.state.pageModel.blocks[blockIdx] as FormModel;
                const fieldModel = formModel.fields[fieldIdx];
                const key = fieldModel.key;
                const record = formModel.record || {};

                if (fieldModel.type === 'relationship') {
                    const relationshipFieldModel = fieldModel as RelationshipFieldModel;
                    const { captionKey, tableCaptionKey, maxCount, records } = relationshipFieldModel;
                    const selectedIds: string[] = value;

                    relationshipFieldModel.isModalOpen = false;
                    relationshipFieldModel.selectedIds = value;
                    formModel.fields[fieldIdx] = relationshipFieldModel;

                    const captions: string[] = selectedIds.map((id) => {
                        return (records || []).find((r) => id === r.id)[tableCaptionKey];
                    });

                    if (_.size(selectedIds) === 0) {
                        record[key] = null;
                        record[captionKey] = undefined;

                    } else if (maxCount === 1) {
                        record[key] = value[0];
                        record[captionKey] = captions[0];

                    } else {
                        record[key] = value;
                        record[captionKey] = captions.join(', ');
                    }

                } else {
                    record[key] = value || null;
                }

                formModel.record = record;
                const state = { ...this.state };
                state.pageModel.blocks[blockIdx] = formModel;
                this.setState(state);
            },

            onFormSaveRecord: (blockIdx: number) => {
                const formModel = this.state.pageModel.blocks[blockIdx] as FormModel;
                const qs = queryString.stringify({ language_id: this.state.language });
                Ajax.post(`/api/${formModel.saveHandler}/?${qs}`, formModel.record)
                    .then(() => {
                        page(formModel.cancelPage);
                    });
            },

            onFormRemoveRecord: (blockIdx: number) => {
                const formModel = this.state.pageModel.blocks[blockIdx] as FormModel;
                const record: any = formModel.record || {};
                const qs = queryString.stringify({ id: record.id });
                Ajax.del(`/api/${formModel.removeHandler}/?${qs}`)
                    .then(() => {
                        page(formModel.cancelPage);
                    });
            },

            onFormCancel: (blockIdx: number) => {
                const formModel = this.state.pageModel.blocks[blockIdx] as FormModel;
                page(formModel.cancelPage);
            },

            onModalOpen: (blockIdx: number, fieldIdx: number) => {
                const formModel = this.state.pageModel.blocks[blockIdx] as FormModel;
                const selectFieldModel = formModel.fields[fieldIdx] as RelationshipFieldModel;
                selectFieldModel.isModalOpen = true;
                const state = { ...this.state, fetchModal: { blockIdx, fieldIdx, selectFieldModel } };
                (state.pageModel.blocks[blockIdx] as FormModel).fields[fieldIdx] = selectFieldModel;
                this.setState(state);
            },

            onModalClose: (blockIdx: number, fieldIdx: number) => {
                const formModel = this.state.pageModel.blocks[blockIdx] as FormModel;
                const selectFieldModel = formModel.fields[fieldIdx] as RelationshipFieldModel;
                selectFieldModel.isModalOpen = false;
                const state = { ...this.state };
                (state.pageModel.blocks[blockIdx] as FormModel).fields[fieldIdx] = selectFieldModel;
                this.setState(state);
            },

            onModalTableSelectIds: (blockIdx: number, fieldIdx: number, selectedIds: string[]) => {
                const formModel = this.state.pageModel.blocks[blockIdx] as FormModel;
                const selectFieldModel = formModel.fields[fieldIdx] as RelationshipFieldModel;
                selectFieldModel.selectedIds = selectedIds;
                const state = { ...this.state };
                (state.pageModel.blocks[blockIdx] as FormModel).fields[fieldIdx] = selectFieldModel;
                this.setState(state);
            }
        };

        this._fetch = _.debounce(this._fetch.bind(this), 300);
        this._fetchModal = _.debounce(this._fetchModal.bind(this), 300);
        this.handlers.onTableUploadedFile = _.debounce(this.handlers.onTableUploadedFile.bind(this), 500);
    }

    render() {
        console.log('state', this.state);
        if (this.state.pageContext != null) {
            const props: Props = { ...this.state, ...this.handlers };
            return <Page {...props} />;
        } else {
            return <div />;
        }
    }

    componentDidMount() {
        Ajax.get('/api/viewmodel/website.json')
            .then((response) => {
                // page(/^(?!\/api)/ as any, (pageContext: PageJS.Context) => {
                page('*', (pageContext: PageJS.Context) => {
                    Ajax.get(Util.cleanUrl(`/api/viewmodel/${pageContext.pathname}/index.json`))
                        .then((pageModel: PageModel) => {
                            const query = queryString.parse(pageContext.querystring);

                            if (query.language_id == null) {
                                query.language_id = this.state.language;
                                page(Util.cleanUrl(`${pageContext.pathname}/?${queryString.stringify(query)}`));

                            } else if (pageModel.redirect != null) {
                                page(Util.cleanUrl(`${pageModel.redirect}/?${pageContext.querystring}`));

                            } else {
                                pageModel.blocks.forEach(block => block.isLoading = true);
                                this.setState({
                                    pageContext,
                                    language: query.language_id,
                                    pageModel,
                                    shouldFetchBlocks: true
                                });
                            }
                        });
                });
                page.start({ hashbang: false });

                const languages = response.languages;
                const language = languages[0];
                this.setState({ languages, language });
            });
    }

    componentDidUpdate() {
        if (this.state.shouldFetchBlocks) {
            this.setState({ shouldFetchBlocks: false });
            this._fetch();
        } else if (this.state.fetchModal != null) {
            const { blockIdx, fieldIdx, selectFieldModel } = this.state.fetchModal;
            const state = { ...this.state, fetchModal: undefined };
            selectFieldModel.isLoading = true;
            (state.pageModel.blocks[blockIdx] as FormModel).fields[fieldIdx] = selectFieldModel;
            this.setState(state);
            this._fetchModal(blockIdx, fieldIdx, selectFieldModel);
        }
    }

    _fetch() {
        this.state.pageModel.blocks.forEach((blockModel, i) => {
            this._fetchBlock(blockModel, i);
        });
    }

    _fetchBlock(blockModel: BlockModel, i: number) {
        const state = { ...this.state };
        state.pageModel.blocks[i].isLoading = true;
        this.setState(state);

        switch (blockModel.type) {
            case 'table':
                this._fetchTable(blockModel as TableModel, i);
                break;
            case 'form':
                this._fetchForm(blockModel as FormModel, i);
                break;
            default:
                break;
        }
    }

    _fetchTable(tableModel: TableModel, i: number) {
        const { getHandler } = tableModel;
        const qs = queryString.stringify({ language_id: this.state.language });
        Ajax.get(Util.cleanUrl(`/api/${getHandler}?${qs}`))
            .then((response) => {
                tableModel.records = response;
                tableModel.isLoading = false;
                const state = { ...this.state };
                state.pageModel.blocks[i] = tableModel;
                this.setState(state);
            });
    }

    _fetchForm(formModel: FormModel, i: number) {
        const { pageContext } = this.state;
        if (pageContext != null) {
            if (formModel.getHandler == null) {
                // new record
                formModel.record = {};
                formModel.isLoading = false;
                const state = { ...this.state };
                state.pageModel.blocks[i] = formModel;
                this.setState(state);
            } else {
                Ajax.get(Util.cleanUrl(`/api/${formModel.getHandler}?${pageContext.querystring}`))
                    .then((response) => {
                        formModel.record = response;
                        formModel.isLoading = false;
                        const state = { ...this.state };
                        state.pageModel.blocks[i] = formModel;
                        this.setState(state);
                    });
            }
        }
    }

    _fetchModal(blockIdx: number, fieldIdx: number, selectFieldModel: RelationshipFieldModel) {
        const { getHandler } = selectFieldModel;
        const qs = queryString.stringify({ language_id: this.state.language });
        Ajax.get(Util.cleanUrl(`/api/${getHandler}?${qs}`))
            .then((response) => {
                selectFieldModel.records = response;
                selectFieldModel.isLoading = false;

                const formModel = this.state.pageModel.blocks[blockIdx] as FormModel;
                const record = formModel.record || {};
                const value = record[selectFieldModel.key];

                if (_.isArray(value)) {
                    selectFieldModel.selectedIds = value;
                } else if (value != null) {
                    selectFieldModel.selectedIds = [value];
                } else {
                    selectFieldModel.selectedIds = [];
                }

                const state = { ...this.state };
                (state.pageModel.blocks[blockIdx] as FormModel).fields[fieldIdx] = selectFieldModel;
                this.setState(state);
            });
    }
}

export default App;
