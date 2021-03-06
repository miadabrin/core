const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-select', () => {

	const visualDiff = new VisualDiff('input-select', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, {viewport: {width: 800, height: 1000}});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-select.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	['wc', 'sass'].forEach((type) => {
		['default', 'overflow', 'disabled', 'invalid', 'rtl', 'rtl-overflow'].forEach((name) => {
			const id = `${type}-${name}`;
			it(id, async function() {
				const rect = await visualDiff.getRect(page, `#${id}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		['default', 'overflow', 'invalid', 'rtl', 'rtl-overflow'].forEach((name) => {
			const id = `${type}-${name}`;
			it(`${id}-focus`, async function() {
				await page.$eval(`#${id}`, (elem) => elem.focus());
				const rect = await visualDiff.getRect(page, `#${id}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

});
