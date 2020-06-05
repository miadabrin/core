import '../list-item-placement-marker.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-list-item-placement-marker', () => {
	it('visible', async() => {
		const element = await fixture(html`<d2l-list-item-placement-marker></d2l-list-item-placement-marker>`);
		await expect(element).to.be.accessible();
	});
	it('visible-rtl', async() => {
		const element = await fixture(html`<d2l-list-item-placement-marker dir="rtl"></d2l-list-item-placement-marker>`);
		await expect(element).to.be.accessible();
	});
});
