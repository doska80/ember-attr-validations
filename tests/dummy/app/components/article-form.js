import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ArticleFormComponent extends Component {
  @service store;
  @service router;

  @tracked article = null;

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

  @action
  async publishArticle() {
    try {
      if (!this.article.validate()) return;
      //await this.article.save();
    } catch {
      // Catch article validation exceptions
    }
  }
}
