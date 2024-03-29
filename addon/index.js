import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';
import moment from 'moment';
import { getOwner } from '@ember/application';

class Violations extends EmberObject {
  @tracked erros = [];

  @tracked notBlank = null;
  @tracked notBlankViolation = false;

  @tracked length = null;
  @tracked lengthViolation = false;

  @tracked range = null;
  @tracked rangeViolation = false;

  @tracked min = null;
  @tracked minViolation = false;

  @tracked max = null;
  @tracked maxViolation = false;

  @tracked email = null;
  @tracked emailViolation = false;

  @tracked url = null;
  @tracked urlViolation = false;

  @tracked digits = null;
  @tracked digitsViolation = false;

  @tracked positive = null;
  @tracked positiveViolation = false;

  @tracked positiveOrZero = null;
  @tracked positiveOrZeroViolation = false;

  @tracked negative = null;
  @tracked negativeViolation = false;

  @tracked negativeOrZero = null;
  @tracked negativeOrZeroViolation = false;

  @tracked past = null;
  @tracked pastViolation = false;

  @tracked pastOrPresent = null;
  @tracked pastOrPresentViolation = false;

  @tracked future = null;
  @tracked futureViolation = false;

  @tracked futureOrPresent = null;
  @tracked futureOrPresentViolation = false;

  @tracked custom = null;
  @tracked customViolation = false;

  reset() {
    this.notBlank = null;
    this.notBlankViolation = false;
    this.length = null;
    this.lengthViolation = false;
    this.range = null;
    this.rangeViolation = false;
    this.min = null;
    this.minViolation = false;
    this.max = null;
    this.maxViolation = false;
    this.mail = null;
    this.emailViolation = false;
    this.url = null;
    this.urlViolation = false;
    this.digits = null;
    this.digitsViolation = false;
    this.positive = null;
    this.positiveViolation = false;
    this.positiveOrZero = null;
    this.positiveOrZeroViolation = false;
    this.negative = null;
    this.negativeViolation = false;
    this.negativeOrZero = null;
    this.negativeOrZeroViolation = false;
    this.past = null;
    this.pastViolation = false;
    this.pastOrPresent = null;
    this.pastOrPresentViolation = false;
    this.future = null;
    this.futureViolation = false;
    this.futureOrPresent = null;
    this.futureOrPresentViolation = false;
    this.custom = null;
    this.customViolation = false;
    this.erros = [];
  }

  get hasError() {
  
    return (
      this.notBlankViolation ||
      this.lengthViolation ||
      this.rangeViolation ||
      this.minViolation ||
      this.maxViolation ||
      this.emailViolation ||
      this.urlViolation ||
      this.digitsViolation ||
      this.positiveViolation ||
      this.positiveOrZeroViolation ||
      this.negativeViolation ||
      this.negativeOrZeroViolation ||
      this.pastViolation ||
      this.pastOrPresentViolation ||
      this.futureViolation ||
      this.futureOrPresentViolation ||
      this.customViolation
    );
  }

  get list() {
    this.clearErrors();
    if (this.notBlankViolation) this.erros.push(this.notBlank);
    if (this.lengthViolation) this.erros.push(this.length);
    if (this.rangeViolation) this.erros.push(this.range);
    if (this.minViolation) this.erros.push(this.min);
    if (this.maxViolation) this.erros.push(this.max);
    if (this.emailViolation) this.erros.push(this.email);
    if (this.urlViolation) this.erros.push(this.url);
    if (this.digitsViolation) this.erros.push(this.digits);
    if (this.positiveViolation) this.erros.push(this.positive);
    if (this.positiveOrZeroViolation) this.erros.push(this.positiveOrZero);
    if (this.negativeViolation) this.erros.push(this.negative);
    if (this.negativeOrZeroViolation) this.erros.push(this.negativeOrZero);
    if (this.pastViolation) this.erros.push(this.past);
    if (this.pastOrPresentViolation) this.erros.push(this.pastOrPresent);
    if (this.futureViolation) this.erros.push(this.future);
    if (this.futureOrPresentViolation) this.erros.push(this.futureOrPresent);
    if (this.customViolation) this.erros.push(this.custom);

    return this.erros;
  }

  clearErrors() {
    this.erros = [];
  }

  get print() {
    return this.list.join('<br>');
  }
}

export default function (model) {
  class Tracked {
    @tracked isValid = true;
    debounce = 0;
  }

  model.prototype.violations = new Tracked();

  model.attributes.forEach((obj) => {
    if (obj.isAttribute) {
      model.prototype.violations[obj.name] = Violations.create();

      model.prototype[obj.name + 'Valid'] = async function (action, instance) {
        let hasError = false;
        const value = action?.value ?? action.currentTarget.value;
        const that = instance ?? model.prototype;
        hasError = await validAttr(that, obj, value, hasError);
        that.violations.isValid = !hasError;
      };
    }
  });

  model.prototype.resetViolations = function () {
    model.attributes.forEach((obj) => {
      if (obj.isAttribute) {
        this.violations[obj.name].reset();
      }
    });
  };

  model.prototype.validate = async function () {
    let hasError = false;

    //const intl = getOwner(this).lookup('service:intl');

    for (const item of model.attributes) {
      const obj = item.length == 2 ? item[1] : undefined;
      if (obj?.isAttribute) {
        this.violations[obj.name].reset();

        const value = this[obj.name];

        hasError = await validAttr(this, obj, value, hasError);
      }
    }

    this.attrListener.trigger();

    this.violations.isValid = !hasError;
    return !hasError;
  };

  model.reopen({
    attrListener: service(),
    get hasViolations(){
      let all = [];
      this.constructor.attributes.forEach((obj) => {
        if (obj.isAttribute) {
          all = all.concat(this.violations[obj.name].list);
        }
      });
      return all.length > 0;
    },
  });
}

function emberConfig(that) {
  return (getOwner(that).resolveRegistration('config:environment') || {})[
    'ember-attr-validations'
    ];
}

function message(that, textOrKey) {
  const config = emberConfig(that);
  const isEmberIntl = !!config ? config.emberIntl : false;
  if(isEmberIntl) {
    const intl = getOwner(that).lookup('service:intl')
    if(textOrKey.key){
      return intl.t(textOrKey.key, textOrKey.value)
    }

    return intl.t(textOrKey)
  }

  return textOrKey;
}

async function validAttr(that, obj, value, hasError) {

  const config = emberConfig(that);
  const isEmberIntl = !!config ? config.emberIntl : false;

  that.violations[obj.name].erros.splice(
    0,
    that.violations[obj.name].erros.length
  );
  let now;
  const notBlank = obj.options['notBlank'];
  const length = obj.options['length'];
  const range = obj.options['range'];
  const min = obj.options['min'];
  const max = obj.options['max'];
  const email = obj.options['email'];
  const url = obj.options['url'];
  const digits = obj.options['digits'];
  const positive = obj.options['positive'];
  const positiveOrZero = obj.options['positiveOrZero'];
  const negative = obj.options['negative'];
  const negativeOrZero = obj.options['negativeOrZero'];
  const past = obj.options['past'];
  const pastOrPresent = obj.options['pastOrPresent'];
  const future = obj.options['future'];
  const futureOrPresent = obj.options['futureOrPresent'];
  const custom = obj.options['custom'];

  if (custom) {
    that.violations[obj.name].customViolation = false;
    assert(`[BUG] The "validation" function is missing to validate "custom" in the "${obj.name}" attribute`, !!custom.validation && typeof custom.validation === 'function');
    that.violations.debounce = custom.debounce;
    const msg = await custom.validation(value, that);
    if (msg !== undefined && msg.trim() !== '') {
      that.violations[obj.name].custom = message(that, msg) ;
      that.violations[obj.name].customViolation = true;
      hasError = true;
    }
  }

  if (notBlank) {
    that.violations[obj.name].notBlankViolation = false;
    if (value === undefined || value === null || value.trim() === '') {
      that.violations[obj.name].notBlank = message(that, notBlank);
      that.violations[obj.name].notBlankViolation = true;
      hasError = true;
    }
  }

  if (digits) {
    that.violations[obj.name].digitsViolation = false;
    if (!!value && isNaN(value)) {
      that.violations[obj.name].digits = message(that, digits);
      that.violations[obj.name].digitsViolation = true;
      hasError = true;
    }
  }

  if (length) {
    that.violations[obj.name].lengthViolation = false;

    if (!!length.max) {
      assert(`[BUG] The "max" property is not number to validate "length" in the "${obj.name}" attribute`, typeof length.max === 'number');
    }

    if (!!length.min) {
      assert(`[BUG] The "min" property is not number to validate "length" in the "${obj.name}" attribute`, typeof length.min === 'number');
    }

    if (!!length.min && !!length.max) {
      if (!!value && (value.length < parseInt(length.min) || value.length > length.max)) {
        that.violations[obj.name].length = message(that, length.message);
        that.violations[obj.name].lengthViolation = true;
        hasError = true;
      }
    }

    if (!length.min && !!length.max) {
      if (!!value && value.length > length.max) {
        that.violations[obj.name].length = message(that, length.message);
        that.violations[obj.name].lengthViolation = true;
        hasError = true;
      }
    }

    if (!length.max && !!length.min) {
      if (!!value && value.length < length.min) {
        that.violations[obj.name].length = message(that, length.message);
        that.violations[obj.name].lengthViolation = true;
        hasError = true;
      }
    }

  }


  if (range) {
    that.violations[obj.name].rangeViolation = false;

    assert(`[BUG] The "max" property is not number to validate "range" in the "${obj.name}" attribute`, typeof range.max === 'number');
    assert(`[BUG] The "min" property is not number to validate "range" in the "${obj.name} attribute"`, typeof range.min === 'number');

    if (!!value && (value < parseInt(range.min) || value > range.max)) {
      that.violations[obj.name].range = message(that, range.message);
      that.violations[obj.name].rangeViolation = true;
      hasError = true;
    }
  }

  if (min) {
    that.violations[obj.name].minViolation = false;
    assert(`[BUG] The "value" property is missing to validate "min" in the "${obj.name}" attribute`, !!min.value && parseInt(min.value) !== NaN);

    if (!!value && (isNaN(parseInt(value)) || parseInt(value) < min.value)) {
      that.violations[obj.name].min = message(that, min.message);
      that.violations[obj.name].minViolation = true;
      hasError = true;
    }
  }

  if (max) {
    that.violations[obj.name].maxViolation = false;
    assert(`[BUG] The "value" property is missing to validate "max" in the "${obj.name}" attribute`, !!max.value && parseInt(max.value) !== NaN);

    if (!!value && (isNaN(parseInt(value)) || parseInt(value) > max.value)) {
      that.violations[obj.name].max = message(that, max.message);
      that.violations[obj.name].maxViolation = true;
      hasError = true;
    }
  }

  if (email) {
    that.violations[obj.name].emailViolation = false;
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    if (!!value && !validateEmail(value)) {
      that.violations[obj.name].email = message(that, email);
      that.violations[obj.name].emailViolation = true;
      hasError = true;
    }
  }

  if (url) {
    that.violations[obj.name].urlViolation = false;
    const validateUrl = (url) => {
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
        'i'
      );

      return !!url && pattern.test(url);
    };

    if (!!value && !validateUrl(value)) {
      that.violations[obj.name].url = message(that, url);
      that.violations[obj.name].urlViolation = true;
      hasError = true;
    }
  }

  if (positive) {
    that.violations[obj.name].positiveViolation = false;
    if (!!value && (isNaN(parseInt(value)) || parseInt(value) <= 0)) {
      that.violations[obj.name].positive =  message(that, positive);
      that.violations[obj.name].positiveViolation = true;
      hasError = true;
    }
  }

  if (positiveOrZero) {
    that.violations[obj.name].positiveOrZeroViolation = false;
    if (!!value && (isNaN(parseInt(value)) || parseInt(value) < 0)) {
      that.violations[obj.name].positiveOrZero = message(that, positiveOrZero);
      that.violations[obj.name].positiveOrZeroViolation = true;
      hasError = true;
    }
  }

  if (negative) {
    that.violations[obj.name].negativeViolation = false;
    if (!!value && (isNaN(parseInt(value)) || parseInt(value) >= 0)) {
      that.violations[obj.name].negative = message(that, negative);
      that.violations[obj.name].negativeViolation = true;
      hasError = true;
    }
  }

  if (negativeOrZero) {
  that.violations[obj.name].negativeOrZeroViolation = false;
    if (!!value && (isNaN(parseInt(value)) || parseInt(value) > 0)) {
      that.violations[obj.name].negativeOrZero = message(that, negativeOrZero);
      that.violations[obj.name].negativeOrZeroViolation = true;
      hasError = true;
    }
  }

  function getDate(dateFormat) {
    let date;
    if (dateFormat) {
      return moment(value, dateFormat, true)?.toDate();
    } else {
      return Date.parse(value)
    }
  }


  if (past) {
    that.violations[obj.name].pastViolation = false;
    now = new Date();
    now.setHours(0, 0, 0, 0);
    const date = getDate(past.dateFormat);
    const isValidDate = (!!value && (date !== 'Invalid date' || !date?.isValid()));

    if (isValidDate && !(date < now)) {
      that.violations[obj.name].past = message(that, past.message);
      that.violations[obj.name].pastViolation = true;
      hasError = true;
    }
  }

  if (pastOrPresent) {
    that.violations[obj.name].pastOrPresentViolation = false;
    now = new Date();
    now.setHours(0, 0, 0, 0);
    const date = getDate(pastOrPresent.dateFormat);
    const isValidDate = (!!value && (date !== 'Invalid date' || !date?.isValid()));

    if (isValidDate && !(date <= now)) {
      that.violations[obj.name].pastOrPresent = message(that, pastOrPresent.message);
      that.violations[obj.name].pastOrPresentViolation = true;
      hasError = true;
    }
  }

  if (future) {
    now = new Date();
    now.setHours(0, 0, 0, 0);
    const date = getDate(future.dateFormat);
    const isValidDate = (!!value && (date !== 'Invalid date' || !date?.isValid()));

    if (isValidDate && !(date > now)) {
      that.violations[obj.name].future = message(that, future.message);
      that.violations[obj.name].futureViolation = true;
      hasError = true;
    }
  }

  if (futureOrPresent) {
    that.violations[obj.name].futureOrPresentViolation = false;
    now = new Date();
    now.setHours(0, 0, 0, 0);
    const date = getDate(futureOrPresent.dateFormat);
    const isValidDate = (!!value && (date !== 'Invalid date' || !date?.isValid()));

    if (isValidDate && !(date >= now)) {
      that.violations[obj.name].futureOrPresent = message(that, futureOrPresent.message);
      that.violations[obj.name].futureOrPresentViolation = true;
      hasError = true;
    }
  }
  return hasError;
}
