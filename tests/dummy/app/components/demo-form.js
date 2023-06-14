import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class extends Component {
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
      this.user.isSaving ||
      this.user.violations.hasViolations
    );
  }

  @action
  async save() {
    if (!this.user.validate()) return;
    //await this.article.save();

  }
}
