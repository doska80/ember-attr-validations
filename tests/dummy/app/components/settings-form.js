import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SettingsFormComponent extends Component {
  @service store;
  @service router;

  @tracked user = null;

  constructor() {
    super(...arguments);
    this.user = this.store.createRecord('user');
  }

  get buttonIsDisabled() {
    return (
      !this.user.hasDirtyAttributes ||
      this.user.isSaving
    );
  }

  @action
  async save() {
    if (!this.user.validate()) return;
    //await this.article.save();
  }
}
