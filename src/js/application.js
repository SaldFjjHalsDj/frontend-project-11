import '../scss/styles.scss';
import _ from 'lodash';
import * as yup from 'yup';
import i18next from 'i18next';
import processStates from './states.js';
import resources from './locales/index.js';
import watcher from './watcher.js';

const validate = (url) => {
    const scheme = yup
        .string()
        .trim()
        .required()
        .url();

    try {
        scheme.validateSync(url);

        return null;
    } catch (e) {
        return e;
    }
};

const postRss = (watchedState) => {
    watchedState.processStateError = null;
    watchedState.processState = processStates.finished;
    watchedState.form.processState = processStates.finished;
  };

export default () => {
    const defaultLanguage = 'ru';

    const state = {
        rssUrls: [],
        feeds: [],
        posts: [],
        processStateError: null,
        processState: processStates.initial,
        form: {
          valid: true,
          processStateError: null,
          processState: processStates.initial,
        },
      };

    const elements = {
        feedForm: {
            form: document.querySelector('.rss-form'),
            input: document.querySelector('[name="add-rss"]'),
            submitButton: document.querySelector('button[type="submit"]'),
          },

          messageContainer: document.querySelector('.message-container'),
    };

    const i18nextInstance = i18next.createInstance();

    yup.setLocale(resources.yup);

    return i18nextInstance.init({
        lng: defaultLanguage,
        resources: { ru: resources.ru },
    }).then(() => {
        const watchedState = watcher(state, elements, i18nextInstance);

        elements.feedForm.form.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            const rssUrl = formData.get('add-rss');

            watchedState.processStateError = null;
            watchedState.processState = processStates.initial;
            watchedState.form.valid = true;
            watchedState.form.processStateError = null;
            watchedState.form.processState = processStates.sending;

            const validateError = validate(rssUrl, watchedState.rssUrls);

            if (validateError) {
              watchedState.form.valid = false;
              watchedState.form.processStateError = validateError.message;
              watchedState.form.processState = processStates.failed;
              return;
            }

            postRss(watchedState);
        });
    });
};
