const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-calendar', () => {

	const visualDiff = new VisualDiff('calendar', __dirname);

	let browser, page;

	const firstCalendarOfPage = '#contains-today-diff-selected';

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, {viewport: {width: 400, height: 1800}});
		await page.goto(`${visualDiff.getBaseUrl()}/components/calendar/test/calendar.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	it.skip('no selected value', async function() {
		const rect = await visualDiff.getRect(page, '#no-selected');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it.skip('first row only current month days last row contains next month days', async function() {
		const rect = await visualDiff.getRect(page, '#dec-2019');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('localization', () => {

		after(async() => {
			await page.evaluate(() => document.querySelector('html').setAttribute('lang', 'en'));
		});

		[
			'ar',
			'da',
			'de',
			'en',
			'es',
			'fr',
			'ja',
			'ko',
			'nl',
			'pt',
			'sv',
			'tr',
			'zh',
			'zh-tw'
		].forEach((lang) => {
			it.skip(`${lang}`, async function() {
				await page.evaluate(lang => document.querySelector('html').setAttribute('lang', lang), lang);
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('style', () => {
		afterEach(async() => {
			await page.reload();
		});

		it.skip('today selected', async function() {
			const rect = await visualDiff.getRect(page, '#today-selected');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it.skip('focus', async function() {
			await page.$eval(firstCalendarOfPage, (elem) => elem.focus());
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('min and max value', async function() {
			const rect = await visualDiff.getRect(page, '#min-max');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		describe('date', () => {
			it.skip('hover on non-selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="20"] div');
					date.classList.add('d2l-calendar-date-hover');
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it.skip('hover on selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="14"] div');
					date.classList.add('d2l-calendar-date-hover');
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it.skip('focus on non-selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="20"]');
					date.focus();
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it.skip('focus on selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="14"]');
					date.focus();
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it.skip('hover and focus on non-selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="20"] div');
					date.classList.add('d2l-calendar-date-hover');
					const dateParent = date.parentNode;
					dateParent.focus();
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it.skip('hover and focus on selected-value', async function() {
				let date;
				await page.$eval(firstCalendarOfPage, async(calendar) => {
					date = calendar.shadowRoot.querySelector('td[data-date="14"] div');
					const dateParent = date.parentNode;
					dateParent.focus();
				});
				await page.$eval(firstCalendarOfPage, async() => {
					date.classList.add('d2l-calendar-date-hover');
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('interaction', () => {
		afterEach(async() => {
			await page.reload();
		});

		it.skip('click left arrow', async function() {
			await page.$eval('#contains-today-diff-selected', (calendar) => {
				const arrow = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
				arrow.click();
			});
			const rect = await visualDiff.getRect(page, '#contains-today-diff-selected');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it.skip('click right arrow', async function() {
			await page.$eval('#dec-2019', (calendar) => {
				const arrow = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
				arrow.click();
			});
			const rect = await visualDiff.getRect(page, '#dec-2019');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it.skip('initial focus date is selected-value', async function() {
			await tabToDates();
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it.skip('initial focus date is 1st of month', async function() {
			await page.$eval(firstCalendarOfPage, (calendar) => {
				const arrow = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show March"]');
				arrow.click();
			});
			await tabToDates();
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		describe('date selection', () => {
			it.skip('click', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="20"]');
					date.click();
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it.skip('enter', async function() {
				await tabToDates();
				await page.keyboard.press('ArrowRight');
				await page.keyboard.press('Enter');
				await page.keyboard.press('ArrowRight');
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it.skip('space', async function() {
				await tabToDates();
				await page.keyboard.press('ArrowRight');
				await page.keyboard.press('Space');
				await page.keyboard.press('ArrowRight');
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		describe('keys', () => {
			describe('arrow', () => {
				it.skip('up to prev month', async function() {
					await tabToDates();
					await page.keyboard.press('ArrowUp');
					await page.keyboard.press('ArrowUp');
					await page.keyboard.press('ArrowUp');
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it.skip('left to prev month', async function() {
					await tabToDates();
					for (let i = 0; i < 18; i++) {
						await page.keyboard.press('ArrowLeft');
					}
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it.skip('down to next month', async function() {
					await tabToDates();
					await page.keyboard.press('ArrowDown');
					await page.keyboard.press('ArrowDown');
					await page.keyboard.press('ArrowDown');
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it.skip('right to next month', async function() {
					await tabToDates();
					for (let i = 0; i < 18; i++) {
						await page.keyboard.press('ArrowRight');
					}
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});

			describe('other', () => {
				it.skip('END', async function() {
					await tabToDates();
					await page.keyboard.press('End');
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('END max value', async function() {
					await page.$eval('#min-max', (calendar) => {
						const date = calendar.shadowRoot.querySelector('td[data-date="26"][data-month="1"]');
						date.click();
					});

					await page.$eval('#min-max', (calendar) => {
						const date = calendar.shadowRoot.querySelector('td[data-date="26"][data-month="1"]');
						const eventObj = document.createEvent('Events');
						eventObj.initEvent('keydown', true, true);
						eventObj.keyCode = 35;
						date.dispatchEvent(eventObj);
					});

					const rect = await visualDiff.getRect(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it.skip('HOME', async function() {
					await tabToDates();
					await page.keyboard.press('Home');
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('HOME min value', async function() {
					await page.$eval('#min-max', (calendar) => {
						const date = calendar.shadowRoot.querySelector('td[data-date="2"][data-month="1"]');
						date.click();
					});

					await page.$eval('#min-max', (calendar) => {
						const date = calendar.shadowRoot.querySelector('td[data-date="2"][data-month="1"]');
						const eventObj = document.createEvent('Events');
						eventObj.initEvent('keydown', true, true);
						eventObj.keyCode = 36;
						date.dispatchEvent(eventObj);
					});
					const rect = await visualDiff.getRect(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it.skip('PAGEDOWN', async function() {
					await page.$eval(firstCalendarOfPage, (calendar) => {
						const arrow1 = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
						arrow1.click();
						const arrow2 = calendar.shadowRoot.querySelector('d2l-button-icon');
						arrow2.click();
					});
					await tabToDates();
					await page.keyboard.press('PageDown');

					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('PAGEDOWN max value', async function() {
					await page.$eval('#min-max', (calendar) => {
						const date = calendar.shadowRoot.querySelector('td[data-date="17"]');
						const eventObj = document.createEvent('Events');
						eventObj.initEvent('keydown', true, true);
						eventObj.keyCode = 34;
						date.dispatchEvent(eventObj);
					});
					const rect = await visualDiff.getRect(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it.skip('PAGEUP', async function() {
					await page.$eval(firstCalendarOfPage, (calendar) => {
						const arrow1 = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
						arrow1.click();
						const arrow2 = calendar.shadowRoot.querySelector('d2l-button-icon');
						arrow2.click();
					});

					await page.$eval(firstCalendarOfPage, (calendar) => {
						const date = calendar.shadowRoot.querySelector('td[data-date="3"][data-month="0"]');
						date.click();
					});

					await tabToDates();
					await page.keyboard.press('PageUp');

					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('PAGEUP min value', async function() {
					await page.$eval('#min-max', (calendar) => {
						const date = calendar.shadowRoot.querySelector('td[data-date="17"]');
						const eventObj = document.createEvent('Events');
						eventObj.initEvent('keydown', true, true);
						eventObj.keyCode = 33;
						date.dispatchEvent(eventObj);
					});
					const rect = await visualDiff.getRect(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

	const tabToDates = async function() {
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
	};

});
