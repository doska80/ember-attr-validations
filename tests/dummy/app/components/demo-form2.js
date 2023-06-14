import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class extends Component {
  @service store;
  @service router;

  @tracked article = null;
  @tracked showCode = false;
  @tracked file = 'article-model.js';
  @tracked language = 'js';

  constructor() {
    super(...arguments);
    this.article = this.store.createRecord('article');
  }

  get buttonIsDisabled() {
    return (
      !this.article.hasDirtyAttributes ||
      this.article.isSaving ||
      this.article.violations.hasViolations
    );
  }
  // BEGIN-SNIPPET demo-form2
  @action
  async save() {
    if (!this.article.validate()) return;
    //await this.article.save();
  }

  // END-SNIPPET
  @action
  async reset() {
    this.article.violations.rest();
  }

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
