import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class extends Controller {
  queryParams = ['file'];
  @tracked activeForm = 'demo1';

  @action
  changeForm(form) {
    this.activeForm = form;
  }
}
