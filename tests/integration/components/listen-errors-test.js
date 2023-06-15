import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | listen-errors', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const userModal = this.owner.lookup('service:store').createRecord('user');
    this.set('user', userModal);
    await render(hbs`<ListenErrors @model={{this.user}}/>`);

    assert.dom(this.element).hasText('');

  });
});
