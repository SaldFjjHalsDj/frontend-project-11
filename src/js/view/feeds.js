const createFeedElement = (feed) => {
  const item = document.createElement('li');
  item.classList.add('list-group-item');

  const title = document.createElement('h4');
  title.classList.add('h3');
  title.textContent = feed.title;

  const description = document.createElement('p');
  description.classList.add('mb-0');
  description.textContent = feed.description;

  item.append(title, description);

  return item;
};

export default (state, elements, i18nextInstance) => {
  const { feedsContainer } = elements;
  feedsContainer.innerHTML = '';

  const header = document.createElement('h3');
  header.textContent = i18nextInstance.t('headlines.feeds');

  const feedList = document.createElement('ul');
  feedList.classList.add('list-group');

  const feedItems = state.feeds.map(createFeedElement);

  feedList.append(...feedItems);
  feedsContainer.append(header, feedList);
};
