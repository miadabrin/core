import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class Tooltip extends LitElement {

	static get properties() {
		return {
			for: { type: String },
			opened: { type: Boolean, reflect: true },
			openedAbove: { type: Boolean, reflect: true, attribute: 'opened-above' },
			_maxHeight: { type: Number },
			_width: { type: Number },
			_x: { type: Number },
			_y: { type: Number },
			_targetRect: { type: Object },
			_offsetVertical: { type: Number }
		};
	}

	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				color: var(--d2l-color-ferrite);
				display: none;
				left: 0;
				position: absolute;
				text-align: left;
				top: calc(100% + var(--d2l-dropdown-verticaloffset, 20px));
				width: 100%;
				z-index: 1000; /* position on top of floating buttons */
			}

			.d2l-tooltip-target {
				position: absolute;
				display: inline-block;
				pointer-events: none;
				background-color: red;
				height: 1px;
			}

			:host([opened]) {
				display: inline-block;
			}

			.d2l-tooltip-container {
				position: relative;
				width: 100%;
				height: 100%;
			}

			.d2l-tooltip-inner {
				left: 0;
				position: absolute;
				text-align: left;
				top: calc(100% + var(--d2l-dropdown-verticaloffset, 20px));
				width: 100%;
				z-index: 1000; /* position on top of floating buttons */
			}

			.d2l-dropdown-content-pointer {
				position: absolute;
				display: inline-block;
				clip: rect(-5px, 21px, 8px, -7px);
				top: -7px;
				left: calc(50% - 7px);
				z-index: 1;
			}

			.d2l-dropdown-content-pointer > div {
				background-color: #ffffff;
				border: 1px solid var(--d2l-color-mica);
				border-radius: 0.1rem;
				box-shadow: -4px -4px 12px -5px rgba(73, 76, 78, .2); /* ferrite */
				height: 16px;
				width: 16px;
				transform: rotate(45deg);
				-webkit-transform: rotate(45deg);
			}

			:host([opened-above]) .d2l-dropdown-content-pointer {
				top: auto;
				clip: rect(9px, 21px, 22px, -3px);
				bottom: -8px;
			}

			:host([opened-above]) .d2l-dropdown-content-pointer > div {
				box-shadow: 4px 4px 12px -5px rgba(73, 76, 78, .2); /* ferrite */
			}

			.d2l-dropdown-content-container {
				background-color: gray;
			}

		`;
	}

	constructor() {
		super();
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this._onResize = this._onResize.bind(this);
		this._offsetVertical = 20;
	}

	get for() {
		return this._for;
	}
	set for(val) {
		const oldVal = this._for;
		if (oldVal !== val) {
			this._for = val;
			this.requestUpdate('for', oldVal);
			this._targetChanged();
		}
	}

	get opened() {
		return this.__opened;
	}

	set opened(val) {
		const oldVal = this.__opened;
		if (oldVal !== val) {
			this.__opened = val;
			this.requestUpdate('opened', oldVal);
			this._openedChanged(val);
		}
	}

	render() {

		// absolute positioned on top of the target

		const targetStyle = {};
		if (this._targetRect) {
			targetStyle.left = `${this._targetRect.x}px`,
			targetStyle.top = `${this._targetRect.y}px`,
			targetStyle.width = `${this._targetRect.width}px`;
			// console.log(targetStyle);
		}

		return html`
			<div class="d2l-tooltip-target" style=${styleMap(targetStyle)}>
				<div class="d2l-tooltip-container">
					<div class="d2l-tooltip-inner">
						<div class="d2l-dropdown-content-pointer">
							<div></div>
						</div>
					</div>
				</div>
			</div>`
		;
	}

	connectedCallback() {
		super.connectedCallback();

		window.addEventListener('resize', this._onResize);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('resize', this._onResize);
	}

	_targetChanged() {
		const target = this._findTarget();
		if (target) {
			this.id = this.id || getUniqueId();
			target.setAttribute('aria-describedby', this.id);
		}
		this._target = target;
		this._addListeners();
	}

	_findTarget() {
		const parentNode = this.parentNode;
		const ownerRoot = this.getRootNode();

		let target;
		if (this._for) {
			const targetSelector = `#${this.for}`;
			target = ownerRoot.querySelector(targetSelector);
			target = target || (ownerRoot && ownerRoot.host && ownerRoot.host.querySelector(targetSelector));
		} else if (this.customTarget !== undefined) {
			// Set to undefined because it is not used - target is a DOM node, whereas customTarget is an object
			target = undefined;
		} else {
			target = parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? ownerRoot.host : parentNode;
		}
		return target;
	}

	close() {
		// this.opened = false;
	}

	open() {
		this.opened = true;
	}

	_onResize() {
		if (!this.opened) {
			return;
		}
		this.__position();
	}

	__getContentContainer() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-container');
	}

	__getPositionContainer() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-position');
	}

	__getWidthContainer() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-width');
	}

	__getTooltipTarget() {
		return this.shadowRoot.querySelector('.d2l-tooltip-target');
	}

	async _openedChanged(newValue) {
		if (newValue) {
			await this.updateComplete;
			await this.__position();
		}
	}

	async __position() {

		const target = this._target;
		if (!target) {
			return;
		}
		const tooltipTarget = this.__getTooltipTarget();
		if (!tooltipTarget) {
			return;
		}

		const targetRect = target.getBoundingClientRect();
		const tooltipRect = tooltipTarget.getBoundingClientRect();
		const top = targetRect.top - tooltipRect.top + tooltipTarget.offsetTop;
		const left = targetRect.left - tooltipRect.left + tooltipTarget.offsetLeft;

		this._targetRect = {
			x: left,
			y: top + targetRect.height + this._offsetVertical,
			width: targetRect.width
		};
	}

	_getWidth(scrollWidth) {
		let width = window.innerWidth - 40;
		if (width > scrollWidth) {
			width = scrollWidth;
		}
		return width;
	}

	_addListeners() {
		if (this._target) {
			this._target.addEventListener('mouseenter', this.open);
			this._target.addEventListener('mouseleave', this.close);
		}
	}

	_removeListeners() {
		if (this._target) {
			this._target.removeEventListener('mouseenter', this.open);
			this._target.removeEventListener('mouseleave', this.close);
		}
	}
}
customElements.define('d2l-tooltip', Tooltip);