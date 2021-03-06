import './alert.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const states = {
	CLOSED: 'closed', // the toast is closed
	CLOSING: 'closing', // the close animation is running
	PREOPENING: 'preopening', // a pause before running the opening animation because transitions won't run when changing from 'diplay: none' to 'display: block'
	OPENING: 'opening', // the opening animation is running
	OPEN: 'open' // the toast is open
};

class AlertToast extends LitElement {

	static get properties() {
		return {
			buttonText: { type: String, attribute: 'button-text' },
			hideCloseButton: { type: Boolean, attribute: 'hide-close-button' },
			noAutoClose: { type: Boolean, attribute: 'no-auto-close' },
			open: { type: Boolean, reflect: true },
			subtext: { type: String },
			type: { type: String, reflect: true },
			_state: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}

			.d2l-alert-toast-container {
				border-radius: 0.3rem;
				bottom: 1.5rem;
				box-shadow: 0 0.1rem 0.6rem 0 rgba(0,0,0,0.10);
				display: none;
				left: 0;
				margin: 0 auto;
				max-width: 600px;
				position: fixed;
				right: 0;
				width: 100%;
				z-index: 10000;
			}

			.d2l-alert-toast-container:not([data-state="closed"]) {
				display: block;
			}

			.d2l-alert-toast-container[data-state="opening"],
			.d2l-alert-toast-container[data-state="closing"] {
				transition-duration: 250ms;
				transition-property: transform, opacity;
				transition-timing-function: ease-in;
			}

			.d2l-alert-toast-container[data-state="preopening"],
			.d2l-alert-toast-container[data-state="closing"] {
				opacity: 0;
				transform: translateY(0.5rem);
			}

			.d2l-alert-toast-container[data-state="opening"] {
				opacity: 1;
				transform: translateY(0);
			}

			d2l-alert {
				animation: none;
			}

			@media (max-width: 615px) {
				.d2l-alert-toast-container {
					bottom: 12px;
					width: calc(100% - 16px);
				}
			}
		`;
	}

	constructor() {
		super();
		this._hasFocus = false;
		this._hasMouse = false;
		this.hideCloseButton = false;
		this.noAutoClose = false;
		this.open = false;
		this._state = states.CLOSED;
	}

	get open() {
		return this._open;
	}

	set open(val) {
		const oldVal = this._open;
		if (oldVal !== val) {
			this._open = val;
			this.requestUpdate('open', oldVal);
			this._openChanged(val);
		}
	}

	render() {
		return html`
			<div
				class="d2l-alert-toast-container"
				data-state="${this._state}"
				@transitionend=${this._onTransitionEnd}>
				<d2l-alert
					@blur=${this._onBlur}
					button-text="${ifDefined(this.buttonText)}"
					@d2l-alert-closed=${this._onCloseClicked}
					@focus=${this._onFocus}
					?has-close-button="${!this.hideCloseButton}"
					@mouseenter=${this._onMouseEnter}
					@mouseleave=${this._onMouseLeave}
					subtext="${ifDefined(this.subtext)}"
					type="${ifDefined(this.type)}">
					<slot></slot>
				</d2l-alert>
			</div>
		`;
	}

	updated(changedProperties) {
		if (changedProperties.get('open') && this.open === false) {
			this._hasFocus = false;
			this._hasMouse = false;
		}
	}

	get _state() {
		return this.__state;
	}

	set _state(val) {
		const oldVal = this.__state;
		if (oldVal !== val) {
			this.__state = val;
			this.requestUpdate('_state', oldVal);
			this._stateChanged(val, oldVal);
		}
	}

	_closeTimerStart() {
		clearTimeout(this._setTimeoutId);
		if (!this.noAutoClose && !this._hasFocus && !this._hasMouse) {
			const duration = this.buttonText ? 10000 : 4000;
			this._setTimeoutId = setTimeout(() => {
				this.open = false;
			}, duration);
		}
	}

	_closeTimerStop() {
		clearTimeout(this._setTimeoutId);
	}

	_onBlur() {
		this._hasFocus = false;
		this._closeTimerStart();
	}

	_onCloseClicked(e) {
		e.preventDefault();
		this.open = false;
	}

	_onFocus() {
		this._hasFocus = true;
		this._closeTimerStop();
	}

	_onMouseEnter() {
		this._hasMouse = true;
		this._closeTimerStop();
	}

	_onMouseLeave() {
		this._hasMouse = false;
		this._closeTimerStart();
	}

	_onTransitionEnd() {
		if (this._state === states.OPENING) {
			this._state = states.OPEN;
		} else if (this._state === states.CLOSING) {
			this._state = states.CLOSED;
		}
	}

	_openChanged(newOpen) {
		if (newOpen) {
			if (this._state === states.CLOSING) {
				this._state = states.OPENING;
			} else if (this._state === states.CLOSED) {
				if (!reduceMotion) {
					this._state = states.PREOPENING;
					// pause before running the opening animation because transitions won't run when changing from 'diplay: none' to 'display: block'
					this._preopenFrame = requestAnimationFrame(() => {
						this._preopenFrame = requestAnimationFrame(() => {
							this._state = states.OPENING;
						});
					});
				} else {
					this._state = states.OPEN;
				}
			}
			this.setAttribute('role', 'alert');
		} else {
			if (reduceMotion || this._state === states.PREOPENING) {
				cancelAnimationFrame(this._preopenFrame);
				this.removeAttribute('role');
				this._state = states.CLOSED;
			} else if (this._state === states.OPENING || this._state === states.OPEN) {
				this._state = states.CLOSING;
			}
		}
	}

	_stateChanged(newState) {
		if (newState === states.OPEN) {
			this._closeTimerStart();
		} else {
			this._closeTimerStop();
		}
	}
}

customElements.define('d2l-alert-toast', AlertToast);
