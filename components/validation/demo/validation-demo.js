import '../../button/button.js';
import '../../inputs/input-text.js';
import './example-section.js';
import '../validation-group.js';
import '../validation-error-summary.js';
import '../validation-custom.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { inputStyles } from '../../inputs/input-styles.js';
import { LocalizeStaticMixin } from '../../../mixins/localize-static-mixin.js';
import { selectStyles } from '../../inputs/input-select-styles.js';

class ValidationDemo extends LocalizeStaticMixin(LitElement) {

	static get styles() {
		return [inputStyles, selectStyles];
	}
	static get resources() {
		return {
			'en': {
				'checkTitle': 'My Checkbox',
				'checkValidationFailure': '{subject} failed custom validation',
				'nameTitle': 'Name',
				'customInputTitle': 'Custom Input',
				'petsTitle': 'Pets'
			},
		};
	}

	render() {
		return html`
			<d2l-validation-group>
				<d2l-example-section></d2l-example-section>
				<h1>My Form</h1>
				<d2l-validation-error-summary></d2l-validation-error-summary>
				<h2>Primary</h2>
				<fieldset>
					<legend>Choose your favorite monster</legend>

					<input type="radio" id="kraken" name="monster" value="oh no">
					<label for="kraken">Kraken</label><br />

					<input type="radio" id="sasquatch" name="monster" value="wow">
					<label for="sasquatch">Sasquatch</label><br />

				</fieldset>
				<d2l-validation-custom for="mycheck" @d2l-validation-custom-validate=${this._validateCheckbox} failure-text="${this.localize('checkValidationFailure', { subject: this.localize('checkTitle') })}" ></d2l-validation-custom>
				<label for="mycheck">${this.localize('checkTitle')}</label>
				<input type="checkbox" id="mycheck" name="checkers" value="red-black">
				<div>
					<label for="name">${this.localize('nameTitle')}</label>
					<input  class="d2l-input" type="text" id="name" name="name" required minlength="4" maxlength="8" size="10">

					<div>
						<select aria-label="${this.localize('petsTitle')}" class="d2l-input-select" name="pets" id="pet-select" required>
							<option value="">--Please choose an option--</option>
							<option value="dog">Dog</option>
							<option value="cat">Cat</option>
							<option value="hamster">Hamster</option>
							<option value="parrot">Parrot</option>
							<option value="spider">Spider</option>
							<option value="goldfish">Goldfish</option>
						</select>
					</div>
				</div>
				<d2l-validation-custom for="custom-input" @d2l-validation-custom-validate=${this._validateCheckbox} failure-text="${this.localize('checkValidationFailure', { subject: this.localize('customInputTitle') })}" ></d2l-validation-custom>
				<d2l-input-text id="custom-input" label="${this.localize('customInputTitle')}" name="custom-input" required minlength="4"></d2l-input-text>
				<div>
					<h2>Secondary</h2>
					<label for="story">Tell us your story</label>
					<label>
						Implicit label
						<textarea class="d2l-input" aria-labelledby="labelled-by" aria-label="my aria label" title="my title" minlength="20" id="story" name="story" rows="5" cols="33">It was...</textarea>
					</label>
					<div id="labelled-by">Labelled by tootlip</div>
					<div>
						<input type="range" id="b" name="b" value="50" max="100" min="15" /> +
						<input type="number" id="a" name="a" value="10" /> =
						<output name="result" for="a b">60</output>
					</div>
				</div>
				<d2l-button type="submit" name="action">Update</d2l-button>
				<d2l-button type="submit" name="action" value="delete">Delete</d2l-button>
				<button @click=${this._validate} name="abc">Wow</button>
			</d2l-validation-group>
		`;
	}

	async _validate() {
		const group = this.shadowRoot.querySelector('d2l-validation-group');
		const errors = await group.validate();
		if (errors.length === 0) {
			group.commit();
		}
	}

	_validateCheckbox(e) {
		e.detail.resolve(e.detail.source.checked);
	}
}
customElements.define('d2l-validation-demo', ValidationDemo);
