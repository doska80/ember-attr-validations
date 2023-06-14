import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class extends Component {
  @service store;
  @service router;

  @tracked profile = null;
  @tracked showCode = false;
  @tracked file = 'profile-model.js';
  @tracked language = 'js';

  constructor() {
    super(...arguments);
    this.profile = this.store.createRecord('profile');
  }

  get buttonIsDisabled() {
    return (
      !this.profile.hasDirtyAttributes ||
      this.profile.isSaving ||
      this.profile.violations.hasViolations
    );
  }
  // BEGIN-SNIPPET demo-form3
  @action
  async save() {
    if (!this.profile.validate()) return;
    //await this.profile.save();
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
