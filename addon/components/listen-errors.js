import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';

export default class extends Component {
  @tracked list = [];

  isValidationFired = false;

  @service attrListener;

  events = ['focusout', 'input'];

  vkey = null;
  listens = null;

  @action
  addListener() {
    assert(
      `[BUG] The "model" argument is missing`,
      !!this.args.model && typeof this.args.model === 'object'
    );

    this.attrListener.on('attr-valid', this, this.showErrors);

    const atrr = this.args.attr;

    this.listens = this.args.listens?.split(',') ?? ['focusout', 'input'];
    this.vkey = document.querySelector(`[attr="${atrr}"]`);

    const that = this;

    for (let i = 0; i < this.listens.length; i++) {
      assert(
        `[BUG] The list of valid listens are focusout or input for attr: ${this.args.attr}`,
        this.events.includes(this.listens[i])
      );
    }

    if (atrr) {
      this.addEventListeners(this.vkey, this.listens, that, atrr);
    }
  }

  addEventListeners(vkey, listens, that, atrr) {
    if (!!vkey && listens.includes('focusout')) {
      const handler = async function () {
        that.isValidationFired = true;
        await that.validation(atrr, that, vkey);
      };

      vkey.addEventListener('focusout', handler);
    }

    if (!!vkey && listens.includes('input')) {
      const handler = function () {
        if (listens.includes('focusout') && !that.isValidationFired) return;
        that.validation(atrr, that, vkey);
      };

      //vkey.addEventListener('input', debounce(this, handler, 1000));
      vkey.addEventListener('input', handler);
    }
  }

  async validation(atrr, that, vkey) {
    const f = `${atrr}Valid`;
    await that.args.model[f](vkey, that.args.model);
    that.list = that.args.model.violations[atrr].list;
  }

  @action
  showErrors() {
    this.isValidationFired = true;
    const atrr = this.args.attr;
    if (atrr) {
      this.list = this.args.model.violations[atrr].list;
    } else {
      let all = [];
      this.args.model.constructor.attributes.forEach((obj) => {
        if (obj.isAttribute) {
          all = all.concat(this.args.model.violations[obj.name].list);
        }
      });
      this.list = all;
    }
  }

  @action
  destroy() {
    this.attrListener.off('attr-valid', this, this.showErrors);

    const that = this;
    const listens = this.listens;

    const focusoutHandler = function (e) {
      that.isValidationFired = true;
      that.validation(atrr, that, vkey);
    };
    const inputHandler = function (e) {
      if (listens.includes('focusout') && !that.isValidationFired) return;
      that.validation(atrr, that, vkey);
    };

    if (this.vkey) {
      this.vkey.removeEventListener('focusout', focusoutHandler);
      this.vkey.removeEventListener('input', inputHandler);
    }
  }
}
