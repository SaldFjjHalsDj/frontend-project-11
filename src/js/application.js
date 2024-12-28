import { keyBy } from 'lodash';
import '../scss/styles.scss';
import * as yup from 'yup';
import onChange from 'on-change';

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

const renderError = (fieldElement, error) => {
    const feedbackElement = fieldElement.nextElementSibling;
    if (feedbackElement) {
      feedbackElement.textContent = error.message;
      return;
    }
  
    fieldElement.classList.add('is-invalid');
    const newFeedbackElement = document.createElement('div');
    newFeedbackElement.classList.add('invalid-feedback');
    newFeedbackElement.textContent = error.message;
    fieldElement.after(newFeedbackElement);
  };

const renderErrors = (elements, errors, prevError, state) => {
    const [fieldName, fieldElement] = elements.field;
    const error = errors[fieldElement];
    const fieldHadError = has(prevError, fieldName);
    const fieldHasError = has(errors, fieldName);
    if (!fieldHadError && !fieldHasError) {
        return;
      }
  
      if (fieldHadError && !fieldHasError) {
        fieldElement.classList.remove('is-invalid');
        fieldElement.nextElementSibling.remove();
        return;
      }
  
      if (state.form.fieldUi.touched[fieldName] && fieldHasError) {
        renderError(fieldElement, error);
      }
}

const render = (elements, initialState) => (path, value, prevValue) => {
    switch (path) {
        case 'submitProcess.processState':
            handleProcessState(elements, value);
            break;
      
          case 'submitProcess.processError':
            handleProcessError();
            break;
      
          case 'form.valid':
            elements.submitButton.disabled = !value;
            break;
      
          case 'form.errors':
            renderErrors(elements, value, prevValue, initialState);
            break;
      
          default:
            break;
    }
};

const app = async () => {
    const elements = {
        container: document.querySelector('container'),
        form: document.querySelector('[data-form="submit"]'),
        field: document.getElementById('rss-input'),
        submitButton: document.querySelector('btn-primary'),
    };

    const initialState = {
        submitProcess: {
            processState: 'filling',
            processError: null,
        },
        form: {
            valid: true,
            errors: {},
            field: {
                rss: '',
            },
            fieldUI: {
                rss: false,
            },
        },
    };

    const state = onChange(initialState, render(elements, initialState));

    const [fieldName, fieldElement] = elements.field;
    fieldElement.addEventListener('input', (e) => {
        const { value } = e.target;
        state.form.field[fieldName] = value;
        state.form.fieldUI[fieldName] = true;
        const errors = validate(state.form.field);
        state.form.errors = errors;
        state.form.valid = isEmpty(errors);
    });

    elements.form.addEventListener('submit', async (e) => {
        e.preventDefault();

        state.submitProcess.processState = 'sending';
        state.submitProcess.processError = null;

        try {
            const date = {
                rss: state.form.field.rss,
            };
            state.submitProcess.processState = 'sent';
        } catch (err) {
            state.submitProcess.processState = 'error';
            state.submitProcess.processError = errorMessage.network.error;
            throw err;
        }
    });
};

export default app;
