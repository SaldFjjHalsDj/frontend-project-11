// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/');
});

const URLS = [
  'https://dev.to/feed',
  'https://lorem-rss.hexlet.app/feed',
  'rss url....',
  'https://google.com',
  '          ',
  'https://192.151.161.11',
  'https://lorem-rss.herokuapp.com/feed?unit=hour',
];

test.describe('Common test', () => {
  test('has title', async ({ page }) => {
    await page.goto('http://localhost:8080/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle('RSS agregator');
  });
});

test.describe('Validate Url', () => {
  test('trying to add not url', async ({ page }) => {
    const newUrl = page.getByPlaceholder('Ссылка RSS');
    const postButton = page.getByText('Добавить');

    // Trying first wrong url
    await newUrl.fill(URLS[2]);
    await postButton.click();

    await expect(page.locator('#messageContainer')).toHaveText([
      'Ссылка должна быть валидным URL',
    ]);
  });

  test('trying to add empty field', async ({ page }) => {
    const newUrl = page.getByPlaceholder('Ссылка RSS');
    const postButton = page.getByText('Добавить');

    // Trying first wrong url
    await newUrl.fill(URLS[4]);
    await postButton.click();

    await expect(page.locator('#messageContainer')).toHaveText([
      'Поле не должно быть пустым',
    ]);
  });

  test('trying to add url without rss', async ({ page }) => {
    const newUrl = page.getByPlaceholder('Ссылка RSS');
    const postButton = page.getByText('Добавить');

    // Trying first wrong url
    await newUrl.fill(URLS[3]);
    await postButton.click();

    await expect(page.locator('#messageContainer')).toHaveText([
      'Ресурс не содержит валидный RSS',
    ]);
  });

  test('trying to add wrong url', async ({ page }) => {
    const newUrl = page.getByPlaceholder('Ссылка RSS');
    const postButton = page.getByText('Добавить');

    // Trying first wrong url
    await newUrl.fill(URLS[5]);
    await postButton.click();

    await expect(page.locator('#messageContainer')).toHaveText([
      'Ошибка сети',
    ], { timeout: 7500, });
  });

  test('trying to add correct url', async ({ page }) => {
    const newUrl = page.getByPlaceholder('Ссылка RSS');
    const postButton = page.getByText('Добавить');

    // Trying first wrong url
    await newUrl.fill(URLS[0]);
    await postButton.click();

    await expect(page.locator('#messageContainer')).toHaveText([
      'RSS успешно загружен',
    ]);
  });
});

test.describe('Trying add Url', () => {
  test('shouldn\'t do anything', async ({ page }) => {
    const postButton = page.getByText('Добавить');

    // Try to add nothing
    await postButton.click();

    await expect(page.locator('#messageContainer')).toHaveText([
      '',
    ]);
  });

  test('should allow to add new feed', async ({ page }) => {
    const newUrl = page.getByPlaceholder('Ссылка RSS');
    const postButton = page.getByText('Добавить');

    // Add first url to feeds list
    await newUrl.fill(URLS[0]);
    await postButton.click();

    await expect(page.locator('#messageContainer')).toHaveText([
      'RSS успешно загружен',
    ]);

    // Add second url to feeds list
    await newUrl.fill(URLS[1]);
    await postButton.click();

    await expect(page.locator('#messageContainer')).toHaveText([
      'RSS успешно загружен',
    ]);
  });

  test('shouldn\'t allow to add existing feed', async ({ page }) => {
    const newUrl = page.getByPlaceholder('Ссылка RSS');
    const postButton = page.getByText('Добавить');

    // Add first url to feeds list
    await newUrl.fill(URLS[0]);
    await postButton.click();

    await expect(page.locator('#messageContainer')).toHaveText([
      'RSS успешно загружен',
    ]);

    // Trying to add existing url
    await newUrl.fill(URLS[0]);
    await postButton.click();

    await expect(page.locator('#messageContainer')).toHaveText([
      'RSS уже существует',
    ]);
  });
});

test.describe('Check posts', () => {
  test('check modal working', async ({ page }) => {
    const newUrl = page.getByPlaceholder('Ссылка RSS');
    const postButton = page.getByText('Добавить');

    // Add url to feed list
    await newUrl.fill(URLS[6]);
    await postButton.click();

    await expect(page.locator('#messageContainer')).toHaveText([
      'RSS успешно загружен',
    ]);
    
    const event = new Date();
    const date = event.toISOString();
    const lookPost = page.locator('li').filter({ hasText: `Lorem ipsum ${date.slice(0,16)}` }).getByRole('button');
  });
});