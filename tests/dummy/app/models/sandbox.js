import Model, { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import validation from 'ember-attr-validations';
@validation
export default class SandboxModel extends Model {
  @service store;

  @attr({ notBlank: 'notBlank message'})
  notBlank;

  @attr({ digits: 'digits message'})
  digits;

  @attr({min: { value: 5, message: 'Min message' }})
  min;

  @attr({max: { value: 5, message: 'Max message' }})
  max;

  @attr({
    length: {
      min: 5,
      max: 10,
      message: 'length message',
    },
  })
  length;

  @attr({
    range: {
      min: 5,
      max: 10,
      message: 'range message',
    },
  })
  range;

  @attr({ email: 'email message'})
  email;

  @attr({ url: 'url message'})
  url;

  @attr({ positive: 'positive message'})
  positive;

  @attr({ positiveOrZero: 'positive message'})
  positiveOrZero;

  @attr({ negative: 'negative message'})
  negative;

  @attr({ negativeOrZero: 'negativeOrZero message'})
  negativeOrZero;

  @attr({past: { dateFormat: 'DD/MM/YYYY', message: 'past message' }})
  past;

  @attr({pastOrPresent: { dateFormat: 'DD/MM/YYYY', message: 'pastOrPresent message' }})
  pastOrPresent;

  @attr({future: { dateFormat: 'DD/MM/YYYY', message: 'future message' }})
  future;

  @attr({futureOrPresent: { dateFormat: 'DD/MM/YYYY', message: 'futureOrPresent message' }})
  futureOrPresent;



}
