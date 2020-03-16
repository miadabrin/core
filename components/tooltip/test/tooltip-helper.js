const getEvent = (page, selector, name) => {
	return page.$eval(selector, (elem, name) => {
		return new Promise((resolve) => {
			elem.addEventListener(name, resolve, { once: true });
		});
	}, name);
};

module.exports = {

	getShowEvent(page, selector) {
		return getEvent(page, selector, 'd2l-tooltip-show');
	},

	getHideEvent(page, selector) {
		return getEvent(page, selector, 'd2l-tooltip-hide');
	},

	async show(page, selector) {
		const openEvent = this.getShowEvent(page, selector);
		const tooltipSelector = `${selector} d2l-tooltip`;
		await page.$eval(tooltipSelector, tooltip => {
			return new Promise(resolve => {
				tooltip.shadowRoot.addEventListener('animationend', () => resolve(), { once: true });
				tooltip.show();
			});
		});
		return openEvent;
	},

	async hide(page, selector) {
		const hideEvent = this.getHideEvent(page, selector);
		const tooltipSelector = `${selector} d2l-tooltip`;
		await page.$eval(tooltipSelector, tooltip => tooltip.hide());
		return hideEvent;
	}

};
