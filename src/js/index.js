import { keyBy } from 'lodash';
import '../scss/styles.scss';
import * as yup from 'yup';

const schema = yup.object().shape({
    url: yup.string().reqired('rss url must be valid').url(),
});

const validate = (field) => {
    try {
        schema.validateSync(field, { abortEarly: false });
        return {};
    } catch (e) {
        return keyBy(e.inner, 'path');
    }
};

const handleProcessState = (elements, processState) => {
    switch (processState) {
        case 'sent':
            elements.container.innerHTML = 'Done!';
            break;
        case 'error':
            elements.submitButton.disabled = false;
            break;
        case 'sending':
            elements.submitButton.disabled = true;
            break;
        case 'filling':
            elements.submitButton.disabled = false;
            break;
        default:
            throw new Error(`Unknown process state: ${processState}`);
    }
};

const app = async () => {
    const elements = {
        container: document.querySelector('input-group'),
        field: document.getElementById('rss-input'),
        submitButton: document.querySelector('btn-primary'),
    };

    const initialState = {
        submitProcess: {
            processState: 'filling',
            processError: null,
        },
    };
};

export default app;
