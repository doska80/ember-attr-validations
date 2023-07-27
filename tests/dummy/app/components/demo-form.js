import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class extends Component {
  @service store;
  @service router;

  @tracked user = null;
  @tracked showCode = false;
  @tracked file = 'user-model.js';
  @tracked language = 'js';

  constructor() {
    super(...arguments);
    this.user = this.store.createRecord('user');
  }

  get buttonIsDisabled() {
    return (
      !this.user.hasDirtyAttributes ||
      this.user.isSaving ||
      this.user.hasViolations
    );
  }
  // BEGIN-SNIPPET demo-form
  @action
  async save() {
    if (!this.user.validate()) return;
    //await this.user.save();
  }
  // END-SNIPPET
  @action
  toggleShowCode() {
    this.showCode = !this.showCode;
  }

  @action
  changeFile(file, language) {
    this.file = file;
    this.language = language;
  }
}
