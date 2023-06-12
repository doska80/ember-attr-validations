import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SettingsFormComponent extends Component {
  @service store;
  @service router;

  @tracked sandbox = null;

  constructor() {
    super(...arguments);
    this.sandbox = this.store.createRecord('sandbox');
  }


  @action
  async save() {
    this.sandbox.validate();
  }
}
