export interface Captions {
    yes: { [languageId: string]: string };
    no: { [languageId: string]: string };
    selectN: { [languageId: string]: string };
    action: { [languageId: string]: string };
    create: { [languageId: string]: string };
    edit: { [languageId: string]: string };
    remove: { [languageId: string]: string };
    save: { [languageId: string]: string };
    cancel: { [languageId: string]: string };
    upload: { [languageId: string]: string };
    withSelected: { [languageId: string]: string };
    areYouSure: { [languageId: string]: string };
}

export const DefaultCaptions: Captions = {
    yes: {
        en: 'Yes',
    },
    no: {
        en: 'No',
    },
    selectN: {
        en: 'Select (<%= n %>)',
    },
    action: {
        en: 'Action',
    },
    create: {
        en: 'New',
    },
    edit: {
        en: 'Edit',
    },
    remove: {
        en: 'Remove',
    },
    save: {
        en: 'Save',
    },
    cancel: {
        en: 'Cancel',
    },
    upload: {
        en: 'Upload',
    },
    withSelected: {
        en: 'With <%= n %> selected...',
    },
    areYouSure: {
        en: 'Are you sure?',
    }
};