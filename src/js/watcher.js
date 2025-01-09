import onChange from 'on-change';
import render from './view/index.js';

export default (state, elements, i18nextInstance) => {
    const { feedForm } = elements;

    const rend = {
        processStates: () => render.feedback(state, elements, i18nextInstance),
        'form.processState': () => {
            render.form(state, feedForm, i18nextInstance);
            render.feedback(state, elements, i18nextInstance);
        },
    };

    const watchedState = onChange(state, (path) => {
        rend[path]?.();
    });

    return watchedState;
};
