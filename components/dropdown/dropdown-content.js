import { html, LitElement } from 'lit-element/lit-element.js';
import { DropdownContentMixin } from './dropdown-content-mixin.js';
import { dropdownContentStyles } from './dropdown-content-styles.js';

class DropdownContent extends DropdownContentMixin(LitElement) {

	static get properties() {
		return {};
	}

	static get styles() {
		return [dropdownContentStyles];
	}

	render() {
		return html`
		<div class="d2l-dropdown-content-position">
			${this._renderWidthContainer(() => html`
				<div class="d2l-dropdown-content-top"></div>
					${this._renderContentContainer(() => (html`<slot></slot>`))}
				<div class="d2l-dropdown-content-bottom"></div>
			`)}
		</div>
		<div class="d2l-dropdown-content-pointer">
			<div></div>
		</div>
		`;
	}

}
customElements.define('d2l-dropdown-content', DropdownContent);