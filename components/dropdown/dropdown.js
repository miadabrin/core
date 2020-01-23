import { html, LitElement } from 'lit-element/lit-element.js';
import { DropdownOpenerMixin } from './dropdown-opener-mixin.js';
import { dropdownOpenerStyles } from './dropdown-opener-styles.js';

class Dropdown extends DropdownOpenerMixin(LitElement) {

	static get properties() {
		return {};
	}

	static get styles() {
		return [dropdownOpenerStyles];
	}

	render() {
		return html`<slot></slot>`;
	}

	/**
	 * Gets the opener element with class "d2l-dropdown-opener" (required by d2l-dropdown behavior).
	 * @return {HTMLElement}
	 */
	getOpenerElement() {
		return this.shadowRoot.querySelector('slot')
			.assignedNodes()
			.find(node => node.className === 'd2l-dropdown-opener');
	}

}
customElements.define('d2l-dropdown', Dropdown);