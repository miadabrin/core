import '../dropdown.js';
import '../dropdown-menu.js';
import '../../menu/menu.js';
import '../../menu/menu-item.js';
import '../../menu/menu-item-radio';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const itemFixture = html`
	<div>
		<d2l-dropdown>
			<button class="d2l-dropdown-opener">Open it!</button>
			<d2l-dropdown-menu id="dropdown">
				<d2l-menu label="Astronomy">
					<d2l-menu-item text="Introduction" id="first-item"></d2l-menu-item>
					<d2l-menu-item text="Searching for the Heavens "></d2l-menu-item>
					<d2l-menu-item text="The Universe"></d2l-menu-item>
				</d2l-menu>
			</d2l-dropdown-menu>
		</d2l-dropdown>
	</div>
`;

const radioFixture = html`
	<div>
		<d2l-dropdown>
			<button class="d2l-dropdown-opener">Open it!</button>
			<d2l-dropdown-menu id="dropdown">
				<d2l-menu label="Astronomy">
						<d2l-menu-item-radio text="Radio Option 1" value="1" id="first-item"></d2l-menu-item-radio>
						<d2l-menu-item-radio text="Radio Option 2" value="2"></d2l-menu-item-radio>
						<d2l-menu-item-radio text="Radio Option 3" value="3"></d2l-menu-item-radio>
				</d2l-menu>
			</d2l-dropdown-menu>
		</d2l-dropdown>
	</div>
`;

describe('d2l-dropdown-menu', () => {

	describe('auto-close', () => {

		[
			{ name: 'should close when menu item is selected', fixture: itemFixture },
			{ name: 'should close when menu radio item is changed', fixture: radioFixture },
		].forEach((testCase) => {
			it(testCase.name, async() => {
				const dropdown = await fixture(testCase.fixture);
				const content = dropdown.querySelector('[dropdown-content]');
				content.setAttribute('opened', true);
				await oneEvent(content, 'd2l-dropdown-open');
				setTimeout(() => dropdown.querySelector('#first-item').click());
				await oneEvent(content, 'd2l-dropdown-close');
				expect(content.opened).to.be.false;
			});
		});
	});

});
