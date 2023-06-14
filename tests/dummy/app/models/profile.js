// BEGIN-SNIPPET profile-model
import Model, { attr, hasMany } from '@ember-data/model';
import validation from 'ember-attr-validations';

@validation
export default class ProfileModel extends Model {
  @attr({
    notBlank: 'Bio is mandatory',
    length: {
      max: 100,
      message: 'Title must be between 5 and 30 characters',
    },
  })
  bio;

  @attr({
    notBlank: 'Image is mandatory',
    url: 'This field must be a valid url',
  })
  image;

  @attr({
    notBlank: 'City is mandatory',
    length: {
      max: 50,
      message: 'The city must have a maximum of 50 characters',
    },
  })
  city;

  @attr
  following;

  @hasMany('article', { async: false, inverse: 'author' }) articles;
}
// END-SNIPPET
